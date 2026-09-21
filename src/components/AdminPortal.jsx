import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  Truck, 
  BarChart3, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  EyeOff, 
  Database,
  Cpu,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { INITIAL_CHAT_MESSAGES } from '../data/mockData';

export default function AdminPortal({ user, crops, orders, t }) {
  const [auditView, setAuditView] = useState('summary');

  const totalKg = crops.reduce((sum, c) => sum + (c.quantityKg || c.quantity * 100 || 0), 0);
  const totalVolumeInr = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div style={{ padding: '24px 0 40px 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '18px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Administrative Oversight & Governance</h2>
              <span className="tag tag-amber">Root Administration</span>
            </div>
            <p className="text-subtle" style={{ marginTop: '4px', fontSize: '0.9rem' }}>
              System Operator: <strong>{user?.name || 'Chief Governance Officer'}</strong> • {user?.location || 'Central Directorate'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="tag tag-green">Mandi Network: Live</span>
            <span className="tag tag-crypto">AES-GCM 256 Enforced</span>
          </div>
        </div>

        {/* Platform Overview Metrics */}
        <div className="grid-3" style={{ marginBottom: '28px' }}>
          
          <div className="swiss-card">
            <div className="swiss-card-header">
              <span className="text-mono" style={{ color: 'var(--text-muted)' }}>SETTLED CONTRACT VALUE</span>
              <BarChart3 size={18} color="var(--agri-green)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              ₹{totalVolumeInr.toLocaleString()}
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Across {orders.length} institutional procurement contracts
            </p>
          </div>

          <div className="swiss-card">
            <div className="swiss-card-header">
              <span className="text-mono" style={{ color: 'var(--text-muted)' }}>TOTAL LISTED VOLUME</span>
              <Database size={18} color="var(--harvest-amber)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {totalKg.toLocaleString()} kg
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {(totalKg / 1000).toFixed(1)} Metric Tons available from verified growers
            </p>
          </div>

          <div className="swiss-card">
            <div className="swiss-card-header">
              <span className="text-mono" style={{ color: 'var(--text-muted)' }}>AI PRICE MODEL ACCURACY</span>
              <Cpu size={18} color="var(--crypto-blue)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              94.2%
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Model: <strong>AgriPriceNet-v2.4</strong> across regional APMC auctions
            </p>
          </div>

        </div>

        {/* Clean Executive Zero-Knowledge Cryptography Certificate (No Raw Program Code!) */}
        <div className="swiss-card" style={{
          marginBottom: '28px',
          border: '2px solid var(--crypto-blue)'
        }}>
          <div className="swiss-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="var(--crypto-blue)" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                  Zero-Knowledge Cryptographic Privacy Guarantee
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Platform Privacy Compliance: Administrative Eavesdropping Forbidden
                </span>
              </div>
            </div>

            <span className="tag tag-crypto">
              <EyeOff size={12} /> Admin Decryption: Blocked
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            In accordance with legal and privacy standards, farmer-buyer negotiations are sealed with client-side <strong>AES-GCM 256-bit encryption</strong>. Platform administrators have mathematical zero-knowledge of user negotiation messages.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px'
          }}>
            <div style={{
              padding: '14px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <CheckCircle size={16} color="var(--agri-green)" />
                <strong style={{ fontSize: '0.875rem' }}>Client-Side Encryption</strong>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                Keys are derived in the user's browser via SubtleCrypto API. No plaintext keys touch the server.
              </p>
            </div>

            <div style={{
              padding: '14px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Lock size={16} color="var(--crypto-blue)" />
                <strong style={{ fontSize: '0.875rem' }}>Ciphertext-Only Storage</strong>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                The database stores mathematical ciphertexts only. Even direct database inspection yields no intelligible text.
              </p>
            </div>

            <div style={{
              padding: '14px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <FileCheck size={16} color="var(--harvest-amber)" />
                <strong style={{ fontSize: '0.875rem' }}>Audit Status: Passed</strong>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                Zero data leak vulnerability. End-to-end cryptographic seal verified intact.
              </p>
            </div>
          </div>
        </div>

        {/* Active Fleet Logistics Tracking */}
        <div className="swiss-card">
          <div className="swiss-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="var(--agri-green)" />
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                Supply Chain Fleet Tracking (Model: LogixRoute-v1.8)
              </h3>
            </div>
            <span className="tag tag-green">{orders.length} Dispatches</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 8px' }}>Order ID</th>
                  <th style={{ padding: '10px 8px' }}>Crop & Quantity</th>
                  <th style={{ padding: '10px 8px' }}>Route Corridor</th>
                  <th style={{ padding: '10px 8px' }}>Vehicle Class</th>
                  <th style={{ padding: '10px 8px' }}>Est. Freight</th>
                  <th style={{ padding: '10px 8px' }}>Milestone</th>
                  <th style={{ padding: '10px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {order.id}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <strong>{order.cropName}</strong> ({(order.quantityKg || order.quantity * 100).toLocaleString()} kg)
                    </td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>
                      {order.pickupLocation} → {order.destination} ({order.distanceKm} km)
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      {order.vehicleAssigned}
                    </td>
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>
                      ₹{order.estimatedFreight.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>
                      {order.trackingMilestone}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <span className={`tag ${order.status === 'In Transit' ? 'tag-amber' : 'tag-green'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
