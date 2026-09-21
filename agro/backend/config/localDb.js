const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class LocalCollection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data || '[]');
    } catch (e) {
      return [];
    }
  }

  _write(records) {
    fs.writeFileSync(this.filePath, JSON.stringify(records, null, 2), 'utf8');
  }

  _matchesFilter(item, query) {
    for (const key of Object.keys(query)) {
      if (key === '$or') {
        const anyMatch = query.$or.some((subQuery) => this._matchesFilter(item, subQuery));
        if (!anyMatch) return false;
        continue;
      }

      const val = item[key];
      const target = query[key];

      if (target instanceof RegExp) {
        if (!target.test(String(val || ''))) return false;
      } else if (typeof target === 'object' && target !== null) {
        if (target.$gte !== undefined && Number(val) < target.$gte) return false;
        if (target.$lte !== undefined && Number(val) > target.$lte) return false;
        if (target.$ne !== undefined && String(val) === String(target.$ne)) return false;
        if (target.$in !== undefined && !target.$in.includes(val)) return false;
      } else {
        if (String(val) !== String(target)) return false;
      }
    }
    return true;
  }

  _wrapDocument(doc) {
    if (!doc) return null;
    const cloned = JSON.parse(JSON.stringify(doc));
    cloned._id = String(cloned._id);

    // Attach password matching method for User documents
    if (this.name === 'users' && cloned.password) {
      cloned.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      };
    }

    // Attach save method
    const collection = this;
    cloned.save = async function () {
      const records = collection._read();
      const idx = records.findIndex((r) => String(r._id) === String(cloned._id));
      if (idx >= 0) {
        // Handle password hashing if changed
        if (cloned.password && !cloned.password.startsWith('$2')) {
          const salt = await bcrypt.genSalt(10);
          cloned.password = await bcrypt.hash(cloned.password, salt);
        }
        records[idx] = { ...records[idx], ...cloned, updatedAt: new Date() };
        collection._write(records);
        return collection._wrapDocument(records[idx]);
      }
      return cloned;
    };

    return cloned;
  }

  find(query = {}) {
    let items = this._read().filter((item) => this._matchesFilter(item, query));
    return new LocalQuery(items, this);
  }

  findOne(query = {}) {
    const items = this._read().filter((item) => this._matchesFilter(item, query));
    return new LocalDocQuery(items.length > 0 ? items[0] : null, this);
  }

  findById(id) {
    const items = this._read();
    const found = items.find((item) => String(item._id) === String(id));
    return new LocalDocQuery(found || null, this);
  }

  async create(doc) {
    const records = this._read();
    const newDoc = {
      _id: doc._id || new crypto.randomBytes(12).toString('hex'),
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (this.name === 'users' && newDoc.password && !newDoc.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      newDoc.password = await bcrypt.hash(newDoc.password, salt);
    }

    records.push(newDoc);
    this._write(records);
    return this._wrapDocument(newDoc);
  }

  async insertMany(docs) {
    const records = this._read();
    const added = [];

    for (const doc of docs) {
      const newDoc = {
        _id: doc._id ? String(doc._id) : crypto.randomBytes(12).toString('hex'),
        ...doc,
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date()
      };
      records.push(newDoc);
      added.push(this._wrapDocument(newDoc));
    }

    this._write(records);
    return added;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const records = this._read();
    const idx = records.findIndex((item) => String(item._id) === String(id));
    if (idx < 0) return null;

    const updated = {
      ...records[idx],
      ...update,
      updatedAt: new Date()
    };

    records[idx] = updated;
    this._write(records);
    return this._wrapDocument(updated);
  }

  async findByIdAndDelete(id) {
    let records = this._read();
    const found = records.find((item) => String(item._id) === String(id));
    if (!found) return null;

    records = records.filter((item) => String(item._id) !== String(id));
    this._write(records);
    return this._wrapDocument(found);
  }

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      this._write([]);
      return { deletedCount: 0 };
    }
    let records = this._read();
    const initialLen = records.length;
    records = records.filter((item) => !this._matchesFilter(item, query));
    this._write(records);
    return { deletedCount: initialLen - records.length };
  }

  async countDocuments(query = {}) {
    const items = this._read().filter((item) => this._matchesFilter(item, query));
    return items.length;
  }

  async aggregate(pipeline = []) {
    let records = this._read();

    for (const stage of pipeline) {
      if (stage.$match) {
        records = records.filter((item) => this._matchesFilter(item, stage.$match));
      }
      if (stage.$group) {
        let sum = 0;
        for (const item of records) {
          sum += Number(item.totalPrice || 0);
        }
        return [{ _id: null, totalValue: sum }];
      }
    }
    return records;
  }
}

class LocalDocQuery {
  constructor(item, collection) {
    this.item = item ? JSON.parse(JSON.stringify(item)) : null;
    this.collection = collection;
  }

  select(projection) {
    if (this.item && projection && projection.includes('-password')) {
      delete this.item.password;
    }
    return this;
  }

  populate(field, select) {
    if (!this.item) return this;
    try {
      const targetColName = field === 'crop' ? 'crops' : 'users';
      const targetCol = new LocalCollection(targetColName);
      const targetRecords = targetCol._read();
      const refId = this.item[field];
      if (refId) {
        const matched = targetRecords.find((r) => String(r._id) === String(refId));
        if (matched) {
          const populated = { ...matched };
          delete populated.password;
          this.item[field] = populated;
        }
      }
    } catch (e) {}
    return this;
  }

  then(resolve, reject) {
    const wrapped = this.item ? this.collection._wrapDocument(this.item) : null;
    return Promise.resolve(wrapped).then(resolve, reject);
  }
}

class LocalQuery {
  constructor(items, collection) {
    this.items = items;
    this.collection = collection;
  }

  sort(sortOption) {
    if (typeof sortOption === 'object' && sortOption !== null) {
      const field = Object.keys(sortOption)[0];
      const dir = sortOption[field];
      this.items.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        if (field === 'createdAt') {
          valA = new Date(valA || 0).getTime();
          valB = new Date(valB || 0).getTime();
        }
        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
      });
    }
    return this;
  }

  limit(count) {
    this.items = this.items.slice(0, count);
    return this;
  }

  skip(count) {
    this.items = this.items.slice(count);
    return this;
  }

  select(projection) {
    // If '-password' is requested, strip password
    if (projection && projection.includes('-password')) {
      this.items = this.items.map((item) => {
        const copy = { ...item };
        delete copy.password;
        return copy;
      });
    }
    return this;
  }

  populate(field, select) {
    // Basic population from related json collections
    try {
      const targetColName = field === 'crop' ? 'crops' : 'users';
      const targetCol = new LocalCollection(targetColName);
      const targetRecords = targetCol._read();

      this.items = this.items.map((item) => {
        const copy = { ...item };
        const refId = copy[field];
        if (refId) {
          const matched = targetRecords.find((r) => String(r._id) === String(refId));
          if (matched) {
            const populated = { ...matched };
            delete populated.password;
            copy[field] = populated;
          }
        }
        return copy;
      });
    } catch (e) {
      // Ignore population errors
    }
    return this;
  }

  then(resolve, reject) {
    const wrapped = this.items.map((item) => this.collection._wrapDocument(item));
    return Promise.resolve(wrapped).then(resolve, reject);
  }
}

module.exports = {
  usersCollection: new LocalCollection('users'),
  cropsCollection: new LocalCollection('crops'),
  cropRequestsCollection: new LocalCollection('cropRequests')
};
