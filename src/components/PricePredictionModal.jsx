import React, { useState } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Info,
  BarChart3
} from 'lucide-react';
import { predictCropPrice, CROP_BASELINES, REGIONAL_INDICES, AI_PRICE_MODEL_VERSION } from '../services/aiPriceEngine';

export default function PricePredictionModal({ onClose, t = {} }) {
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [selectedGrade, setSelectedGrade] = useState("Grade A");
  const [selectedLocation, setSelectedLocation] = useState("Maharashtra (Nashik / Pune)");
  const [quantityKg, setQuantityKg] = useState(2500);

  const prediction = predictCropPrice({
    cropName: selectedCrop,
    grade: selectedGrade,
    location: selectedLocation,
    quantityKg: Number(quantityKg)
  });

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: '740px' }}>
        
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
              <TrendingUp size={20} color="var(--agri-green)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0 }}>{t.price_lab_modal_title || "Mandi Price Benchmark Engine"}</h3>
                <span className="tag tag-green" style={{ fontSize: '0.65rem' }}>
                  APMC Mandi Index
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {t.price_lab_modal_desc || "APMC historical benchmark and mandi rate analysis in ₹/kg"}
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
          
          {/* Controls Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            padding: '14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
            marginBottom: '20px'
          }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Select Crop</label>
              <select 
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="form-select"
                style={{ fontSize: '0.85rem' }}
              >
                {Object.keys(CROP_BASELINES).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Quality Grade</label>
              <select 
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="form-select"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="Grade A">Grade A (Premium / Export)</option>
                <option value="Grade B">Grade B (Standard Market)</option>
                <option value="Grade C">Grade C (Processing / Bulk)</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Trading Mandi Zone</label>
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="form-select"
                style={{ fontSize: '0.85rem' }}
              >
                {Object.keys(REGIONAL_INDICES).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Lot Volume (kg)</label>
              <input 
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
                min="50"
              />
            </div>
          </div>

          {/* Prediction Card in ₹/kg */}
          <div style={{
            border: '2px solid var(--agri-green)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
            backgroundColor: 'var(--bg-card)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span className="text-mono" style={{ color: 'var(--agri-green)', fontWeight: 700, fontSize: '0.8rem' }}>
                  MANDI BENCHMARK RATE
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '2px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                    ₹{prediction.predictedPrice}
                  </span>
                  <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                    / kg (₹{(prediction.predictedPrice * 1000).toLocaleString()} / MT)
                  </span>
                </div>
                <div style={{ marginTop: '2px', fontSize: '0.9rem' }}>
                  Suggested Price Band: <strong>₹{prediction.minPrice} – ₹{prediction.maxPrice} / kg</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="tag tag-green" style={{ fontSize: '0.8rem', padding: '5px 10px' }}>
                  {prediction.confidenceScore}% Market Reliability
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  Baseline: ₹{prediction.baseBenchmark.toFixed(1)} / kg
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              backgroundColor: 'var(--agri-green-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              color: 'var(--agri-green)',
              border: '1px solid var(--agri-green-border)'
            }}>
              <strong>Recommendation:</strong> {prediction.recommendedAction}
            </div>
          </div>

          {/* Price Trend Chart in ₹/kg */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>APMC Historical Trend & 30-Day Outlook (₹ / kg)</h4>
              <span className="text-mono" style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                APMC Grade Index
              </span>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', gap: '12px', paddingBottom: '6px' }}>
                {prediction.trendData.map((item, i) => {
                  const maxVal = Math.max(...prediction.trendData.map(d => d.price)) * 1.15;
                  const barHeight = Math.round((item.price / maxVal) * 95);
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.725rem', fontWeight: 700, marginBottom: '4px' }}>
                        ₹{item.price}
                      </span>
                      <div style={{
                        width: '100%',
                        maxWidth: '40px',
                        height: `${barHeight}px`,
                        backgroundColor: item.isProjected ? 'var(--harvest-amber)' : 'var(--agri-green)',
                        borderRadius: '3px 3px 0 0',
                        opacity: item.isProjected ? 0.9 : 1
                      }} />
                      <span className="text-mono" style={{ fontSize: '0.7rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                        {item.month} {item.isProjected ? '(Forecast)' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Multi-Factor Breakdown */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Pricing Drivers Breakdown</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {prediction.priceDrivers.map((pd, idx) => (
                <div key={idx} style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-card)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '0.825rem' }}>{pd.factor}</strong>
                    <span className={`tag ${pd.impact === 'Positive' ? 'tag-green' : 'tag-neutral'}`} style={{ fontSize: '0.625rem' }}>
                      {pd.impact}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {pd.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.725rem',
            color: 'var(--text-muted)'
          }}>
            <Info size={14} />
            <span>
              <strong>Decision Support:</strong> Informational benchmark for buyer-farmer negotiation. Actual prices depend on physical inspection.
            </span>
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
