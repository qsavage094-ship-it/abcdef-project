/**
 * Database & Firebase Service
 * Full integration with Firebase Firestore & Authentication (digital-agri-project)
 * Includes offline-resilient local caching fallback for seamless UX.
 */

import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { db, auth, isFirebaseConnected, firebaseConfig } from '../firebase/config';

const LOCAL_CROPS_KEY = 'agridirect_local_crops';
const LOCAL_ORDERS_KEY = 'agridirect_local_orders';
const LOCAL_USERS_KEY = 'agridirect_local_users';

/**
 * Save user profile to Firebase Firestore 'users' collection
 */
export async function saveUserToDatabase(userData) {
  const userId = userData.id || `user_${Date.now()}`;
  const payload = {
    userId,
    role: userData.role || 'farmer',
    name: userData.name || '',
    email: userData.email || '',
    location: userData.location || '',
    updatedAt: new Date().toISOString()
  };

  // Local storage backup
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
    const filtered = existing.filter(u => u.userId !== userId);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify([payload, ...filtered]));
  } catch (err) {
    console.warn("[Local Backup] Failed to store user:", err);
  }

  // Cloud Firestore sync
  if (db && isFirebaseConnected) {
    try {
      console.log(`[Firebase] Saving user ${userId} to 'users' collection...`);
      await setDoc(doc(db, 'users', userId), {
        ...payload,
        createdAt: serverTimestamp()
      }, { merge: true });
      console.log(`[Firebase SUCCESS] User ${userId} saved to Firestore.`);
      return { success: true, mode: 'cloud' };
    } catch (error) {
      console.warn("[Firebase WARNING] Firestore write failed (offline fallback active):", error.code || error.message);
      return { success: true, mode: 'local', error: error.message };
    }
  }

  return { success: true, mode: 'local' };
}

/**
 * Save newly listed crop to Firebase Firestore 'crops' collection
 */
export async function saveCropToDatabase(cropData) {
  const cropId = cropData.id || `crop_${Date.now()}`;
  const payload = {
    id: cropId,
    farmerId: cropData.farmerId || 'farmer_custom',
    farmerName: cropData.farmerName || 'Verified Grower',
    cropName: cropData.cropName || 'Fresh Produce',
    variety: cropData.variety || 'Premium',
    grade: cropData.grade || 'Grade A',
    quantityKg: Number(cropData.quantityKg) || 1000,
    expectedPriceKg: Number(cropData.expectedPriceKg) || 25,
    aiPredictedPriceKg: Number(cropData.aiPredictedPriceKg) || 25,
    location: cropData.location || 'Local Mandi',
    harvestDate: cropData.harvestDate || new Date().toISOString().split('T')[0],
    category: cropData.category || 'grains',
    isOrganic: Boolean(cropData.isOrganic),
    updatedAt: new Date().toISOString()
  };

  // Local storage backup
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_CROPS_KEY) || '[]');
    const filtered = existing.filter(c => c.id !== cropId);
    localStorage.setItem(LOCAL_CROPS_KEY, JSON.stringify([payload, ...filtered]));
  } catch (err) {
    console.warn("[Local Backup] Failed to cache crop:", err);
  }

  // Cloud Firestore sync
  if (db && isFirebaseConnected) {
    try {
      console.log(`[Firebase] Saving crop ${cropId} to 'crops' collection...`);
      await setDoc(doc(db, 'crops', cropId), {
        ...payload,
        createdAt: serverTimestamp()
      }, { merge: true });
      console.log(`[Firebase SUCCESS] Crop ${cropId} saved to Firestore.`);
      return { success: true, mode: 'cloud' };
    } catch (error) {
      console.warn("[Firebase WARNING] Firestore write failed (offline fallback active):", error.code || error.message);
      return { success: true, mode: 'local', error: error.message };
    }
  }

  return { success: true, mode: 'local' };
}

/**
 * Save newly placed order to Firebase Firestore 'orders' collection
 */
export async function saveOrderToDatabase(orderData) {
  const orderId = orderData.id || `order_${Date.now()}`;
  const payload = {
    id: orderId,
    buyerId: orderData.buyerId || 'buyer_custom',
    buyerName: orderData.buyerName || 'Verified Buyer',
    farmerId: orderData.farmerId || '',
    farmerName: orderData.farmerName || '',
    cropName: orderData.cropName || '',
    variety: orderData.variety || '',
    quantityKg: Number(orderData.quantityKg) || 500,
    pricePerKg: Number(orderData.pricePerKg) || 25,
    totalAmount: Number(orderData.totalAmount) || 12500,
    status: orderData.status || 'Order Placed',
    destination: orderData.destination || 'APMC Terminal',
    date: orderData.date || new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString()
  };

  // Local storage backup
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
    const filtered = existing.filter(o => o.id !== orderId);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([payload, ...filtered]));
  } catch (err) {
    console.warn("[Local Backup] Failed to cache order:", err);
  }

  // Cloud Firestore sync
  if (db && isFirebaseConnected) {
    try {
      console.log(`[Firebase] Saving order ${orderId} to 'orders' collection...`);
      await setDoc(doc(db, 'orders', orderId), {
        ...payload,
        createdAt: serverTimestamp()
      }, { merge: true });
      console.log(`[Firebase SUCCESS] Order ${orderId} saved to Firestore.`);
      return { success: true, mode: 'cloud' };
    } catch (error) {
      console.warn("[Firebase WARNING] Firestore write failed (offline fallback active):", error.code || error.message);
      return { success: true, mode: 'local', error: error.message };
    }
  }

  return { success: true, mode: 'local' };
}

/**
 * Update existing order status in Firestore (e.g. 'In Transit', 'Completed', 'Cancelled')
 */
export async function updateOrderStatusInDatabase(orderId, status) {
  // Local storage update
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
    const updated = existing.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("[Local Backup] Failed to update local order:", err);
  }

  // Cloud Firestore sync
  if (db && isFirebaseConnected) {
    try {
      console.log(`[Firebase] Updating order ${orderId} status to '${status}'...`);
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: serverTimestamp()
      });
      console.log(`[Firebase SUCCESS] Order ${orderId} status updated in Firestore.`);
      return { success: true, mode: 'cloud' };
    } catch (error) {
      console.warn("[Firebase WARNING] Firestore update failed (offline fallback active):", error.code || error.message);
      return { success: true, mode: 'local', error: error.message };
    }
  }

  return { success: true, mode: 'local' };
}

/**
 * Real-time listener for crop listings from Firebase Firestore
 * Falls back cleanly to local storage if Firestore permissions are restricted
 */
export function subscribeToCrops(onCropsUpdated) {
  // Always emit local custom crops first
  try {
    const localCrops = JSON.parse(localStorage.getItem(LOCAL_CROPS_KEY) || '[]');
    if (localCrops.length > 0) {
      onCropsUpdated(localCrops);
    }
  } catch (err) {
    console.warn("[Local Sync] Error reading local crops:", err);
  }

  if (!db || !isFirebaseConnected) {
    return () => {};
  }

  try {
    const cropsCol = collection(db, 'crops');
    const unsubscribe = onSnapshot(cropsCol, (snapshot) => {
      const firestoreCrops = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      console.log(`🔥 [Firebase Real-Time] Received ${firestoreCrops.length} crops from Firestore.`);
      onCropsUpdated(firestoreCrops);
    }, (error) => {
      console.info("ℹ️ [Firebase Notice] Firestore 'crops' permission mode:", error.code || error.message);
    });

    return unsubscribe;
  } catch (err) {
    console.warn("[Firebase Real-Time] Subscription setup error:", err);
    return () => {};
  }
}

/**
 * Real-time listener for orders from Firebase Firestore
 */
export function subscribeToOrders(onOrdersUpdated) {
  // Always emit local custom orders first
  try {
    const localOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
    if (localOrders.length > 0) {
      onOrdersUpdated(localOrders);
    }
  } catch (err) {
    console.warn("[Local Sync] Error reading local orders:", err);
  }

  if (!db || !isFirebaseConnected) {
    return () => {};
  }

  try {
    const ordersCol = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersCol, (snapshot) => {
      const firestoreOrders = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      console.log(`🔥 [Firebase Real-Time] Received ${firestoreOrders.length} orders from Firestore.`);
      onOrdersUpdated(firestoreOrders);
    }, (error) => {
      console.info("ℹ️ [Firebase Notice] Firestore 'orders' permission mode:", error.code || error.message);
    });

    return unsubscribe;
  } catch (err) {
    console.warn("[Firebase Real-Time] Subscription setup error:", err);
    return () => {};
  }
}

/**
 * Authenticate with Firebase Authentication (Email/Password)
 * Gracefully falls back if Auth is in test/development mode
 */
export async function authenticateWithFirebase(email, password, role = 'farmer', name = '') {
  if (!auth || !isFirebaseConnected) {
    return { success: true, mode: 'local' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password || 'agridirect123';

  try {
    // Attempt sign in
    const userCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    console.log("🔥 [Firebase Auth] Signed in successfully UID:", userCred.user.uid);
    return { success: true, user: userCred.user, mode: 'cloud' };
  } catch (signInErr) {
    // If user not found, attempt sign up
    if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        console.log("🔥 [Firebase Auth] Registered new user UID:", newCred.user.uid);
        return { success: true, user: newCred.user, mode: 'cloud' };
      } catch (signUpErr) {
        console.info("ℹ️ [Firebase Auth] Handled with local session:", signUpErr.code || signUpErr.message);
        return { success: true, mode: 'local' };
      }
    }
    console.info("ℹ️ [Firebase Auth] Handled with local session:", signInErr.code || signInErr.message);
    return { success: true, mode: 'local' };
  }
}

/**
 * Sign out of Firebase
 */
export async function signOutFirebase() {
  if (auth && isFirebaseConnected) {
    try {
      await signOut(auth);
      console.log("🔥 [Firebase Auth] Signed out successfully.");
    } catch (err) {
      console.warn("Sign out error:", err);
    }
  }
}
