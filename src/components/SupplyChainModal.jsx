import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  Navigation, 
  ShieldCheck, 
  Snowflake,
  Package
} from 'lucide-react';
import { optimizeLogistics, ROUTING_MODEL_VERSION } from '../services/supplyChainOptimizer';

export default function SupplyChainModal({ order = null, onClose, t = {} }) {
  const [pickupLocation, setPickupLocation] = useState(order ? order.pickupLocation : "Nashik, Maharashtra");
  const [destination, setDestination] = useState(order ? order.destination : "Vashi APMC, Mumbai");
  const [quantityKg, setQuantityKg] = useState(order ? (order.quantityKg || order.quantity * 100) : 3500);
  const [isPerishable, setIsPerishable] = useState(order ? order.isPerishable : true);

  const logistics = optimizeLogistics({
    pickupLocation,
    destination,
    quantityKg: Number(quantityKg),
    isPerishable
  });

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: '780px' }}>
        
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'var(--agri-green-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)'
            }}>
              <Truck size={20} color="var(--agri-green)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0 }}>{t.supply_chain_modal_title || "Supply Chain Logistics Optimization"}</h3>
                <span className="tag tag-green" style={{ fontSize: '0.65rem' }}>
                  Freight & Fleet Engine
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {t.supply_chain_modal_desc || "Vehicle fleet allocation in kg, highway route distance & dynamic per-kg freight pricing"}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          
          {order && (
            <div style={{
              padding: '8px 12px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.825rem'
            }}>
              <span>Contract: <strong>{order.id}</strong> — {order.cropName}</span>
              <span className="tag tag-amber">{order.status}</span>
            </div>
          )}

          {/* Interactive Routing Parameters Bar in kg */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '10px',
            padding: '14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
            marginBottom: '20px'
          }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Pickup Origin</label>
              <input 
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Destination Hub</label>
              <input 
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Order Volume (kg)</label>
              <input 
                type="number"
                min="100"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Cargo Temperature</label>
              <select 
                value={isPerishable ? "reefer" : "ambient"}
                onChange={(e) => setIsPerishable(e.target.value === "reefer")}
                className="form-select"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="reefer">Cold Storage Reefer</option>
                <option value="ambient">Ambient Freight</option>
              </select>
            </div>
          </div>

          {/* Route & Vehicle Allocation Card */}
          <div style={{
            border: '2px solid var(--text-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
            backgroundColor: 'var(--bg-card)',
            marginBottom: '20px'
          }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Navigation size={16} color="var(--agri-green)" />
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                  Transit Route:
                </span>
                <span className="tag tag-green">
                  {logistics.suggestedRoute}
                </span>
              </div>
              <span className="tag tag-crypto">
                AI Sized Transit
              </span>
            </div>

            <div className="grid-3" style={{ gap: '12px' }}>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                  Road Distance
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {logistics.distanceKm} km
                </div>
              </div>

              <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                  Transit Duration
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {logistics.estimatedDeliveryTime}
                </div>
              </div>

              <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                  Total Freight Cost
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--agri-green)' }}>
                  ₹{logistics.costBreakdown.totalFreightCost.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                  (₹{logistics.costBreakdown.costPerKg} / kg)
                </span>
              </div>
            </div>

            {/* Vehicle Assignment & Capacity Bar in kg */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={15} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    Assigned: {logistics.selectedVehicle.name}
                  </span>
                </div>
                <span className="text-mono" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  {logistics.capacityUtilization}% Utilized ({Number(quantityKg).toLocaleString()} / {logistics.selectedVehicle.maxCapacityKg.toLocaleString()} kg)
                </span>
              </div>

              <div style={{
                height: '7px',
                width: '100%',
                backgroundColor: 'var(--border-light)',
                borderRadius: 'var(--radius-pill)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${logistics.capacityUtilization}%`,
                  backgroundColor: logistics.capacityUtilization > 90 ? 'var(--harvest-amber)' : 'var(--agri-green)'
                }} />
              </div>
            </div>

            <div style={{
              marginTop: '14px',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.775rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px'
            }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Base Vehicle Booking</span>
                <strong>₹{logistics.costBreakdown.baseFare.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Corridor Transit</span>
                <strong>₹{logistics.costBreakdown.transitFare.toLocaleString()}</strong> ({logistics.distanceKm} km)
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Handling Fee</span>
                <strong>₹{logistics.costBreakdown.loadingHandlingFee.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Net Logistics Rate</span>
                <strong style={{ color: 'var(--agri-green)' }}>₹{logistics.costBreakdown.costPerKg} / kg</strong>
              </div>
            </div>

          </div>

          {/* Delivery Milestones */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
              Transit Milestones
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {logistics.milestones.map((m) => (
                <div key={m.step} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: m.status === 'completed' ? 'var(--agri-green-subtle)' : m.status === 'current' ? 'var(--harvest-amber-subtle)' : 'var(--bg-card)',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: m.status === 'completed' ? 'var(--agri-green)' : m.status === 'current' ? 'var(--harvest-amber)' : 'var(--border-light)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {m.status === 'completed' ? '✓' : m.step}
                  </div>

                  <div style={{ flex: 1, fontWeight: 600, fontSize: '0.85rem' }}>
                    {m.label}
                  </div>

                  <span className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {m.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
