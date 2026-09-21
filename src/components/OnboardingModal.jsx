import React, { useState } from 'react';
import { 
  Sprout, 
  Store, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose, initialRole = 'farmer', t = {} }) {
  const [activeTab, setActiveTab] = useState(initialRole === 'buyer' ? 'buyer' : 'farmer');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}>
      <div className="modal-container" style={{ maxWidth: '560px' }}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--agri-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HelpCircle size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                {t.getting_started_title || "Getting Started with AgriDirect"}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {t.guide_subtitle || "Quick 3-step guide for farmers and buyers"}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-primary)' }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          
          {/* Two Short Tabs: For Farmers & For Buyers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            backgroundColor: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => setActiveTab('farmer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
                backgroundColor: activeTab === 'farmer' ? 'var(--agri-green)' : 'transparent',
                color: activeTab === 'farmer' ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              <Sprout size={16} />
              <span>{t.for_farmers_tab || "For Farmers"}</span>
            </button>

            <button
              onClick={() => setActiveTab('buyer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
                backgroundColor: activeTab === 'buyer' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'buyer' ? 'var(--bg-app)' : 'var(--text-secondary)'
              }}
            >
              <Store size={16} />
              <span>{t.for_buyers_tab || "For Buyers"}</span>
            </button>
          </div>

          {/* Tab Content: For Farmers */}
          {activeTab === 'farmer' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--agri-green)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{t.farmer_s1_title || "1. Add Crop"}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t.farmer_s1_desc || "Enter your crop name, variety, grade, available kilograms (kg), and asking price per kg."}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--agri-green)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{t.farmer_s2_title || "2. Check Demand"}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t.farmer_s2_desc || "Review real-time mandi benchmark prices and the 7-day demand forecast to time your sale."}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--agri-green)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{t.farmer_s3_title || "3. Chat with Buyers"}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t.farmer_s3_desc || "Receive procurement enquiries and negotiate contracts directly via private encrypted chat."}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            /* Tab Content: For Buyers */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg-app)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{t.buyer_s1_title || "1. Browse Inventory"}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t.buyer_s1_desc || "Search verified farm listings by crop type, grade, mandi location, and rate per kg."}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg-app)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{t.buyer_s2_title || "2. Book Logistics"}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t.buyer_s2_desc || "Place purchase orders in kg with automated vehicle fleet matching and per-km route pricing."}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg-app)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{t.buyer_s3_title || "3. Message Farmers"}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t.buyer_s3_desc || "Send trade offers, request samples, and coordinate delivery pickups in private E2EE chat."}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-primary"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            <span>{t.got_it_btn || "Got It — Start Trading"}</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
