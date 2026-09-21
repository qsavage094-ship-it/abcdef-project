import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight 
} from 'lucide-react';
import { getDemandForecast, CROP_DEMAND_PROFILES, DEMAND_MODEL_VERSION } from '../services/demandForecastEngine';

export default function DemandForecastModal({ onClose, t = {} }) {
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const forecast = getDemandForecast(selectedCrop);

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: '700px' }}>
        
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'var(--harvest-amber-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)'
            }}>
              <BarChart3 size={20} color="var(--harvest-amber)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0 }}>{t.demand_radar_modal_title || "Market Demand Forecast"}</h3>
                <span className="tag tag-amber" style={{ fontSize: '0.65rem' }}>
                  APMC Procurement Data
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {t.demand_radar_modal_desc || "7-day forward demand trajectories from procurement contracts & processing demand"}
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
          
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '18px' }}>
            {Object.keys(CROP_DEMAND_PROFILES).map(cropKey => (
              <button
                key={cropKey}
                onClick={() => setSelectedCrop(cropKey)}
                className={`btn btn-sm ${selectedCrop === cropKey ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-sm)', padding: '5px 14px', fontSize: '0.8rem' }}
              >
                {cropKey}
              </button>
            ))}
          </div>

          {/* Top Forecast Card */}
          <div style={{
            border: '2px solid var(--harvest-amber)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
            backgroundColor: 'var(--bg-card)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="text-mono" style={{ color: 'var(--harvest-amber)', fontWeight: 700, fontSize: '0.8rem' }}>
                  DEMAND TRAJECTORY: {forecast.cropName.toUpperCase()}
                </span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                      Current Demand
                    </span>
                    <span className="tag tag-neutral" style={{ fontSize: '0.85rem', marginTop: '2px' }}>
                      {forecast.currentDemand}
                    </span>
                  </div>

                  <ArrowUpRight size={18} color="var(--harvest-amber)" />

                  <div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                      Forecast Demand
                    </span>
                    <span className="tag tag-amber" style={{ fontSize: '0.85rem', marginTop: '2px' }}>
                      {forecast.forecastDemand}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                      Period
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {forecast.forecastPeriod}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                      Expected Surge
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--agri-green)' }}>
                      {forecast.changePercent}
                    </span>
                  </div>
                </div>
              </div>

              <span className="tag tag-green">
                <TrendingUp size={12} /> High Demand Reliability
              </span>
            </div>

            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              backgroundColor: 'var(--harvest-amber-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              color: 'var(--harvest-amber)',
              border: '1px solid var(--harvest-amber-border)'
            }}>
              <strong>Demand Catalyst:</strong> {forecast.demandDriver}
            </div>
          </div>

          {/* 7-Day Curve */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Next 7-Day Forward Demand Curve (0–100 Scale)</h4>
              <span className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Trade Volume Index
              </span>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', gap: '10px', paddingBottom: '6px' }}>
                {forecast.dailyForecast.map((df, idx) => {
                  const barHeight = Math.round((df.demandScore / 100) * 95);
                  const isPeak = df.demandScore >= 85;
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.725rem', fontWeight: 700, marginBottom: '4px' }}>
                        {df.demandScore}
                      </span>
                      <div style={{
                        width: '100%',
                        maxWidth: '38px',
                        height: `${barHeight}px`,
                        backgroundColor: isPeak ? 'var(--agri-green)' : 'var(--harvest-amber)',
                        borderRadius: '3px 3px 0 0'
                      }} />
                      <span className="text-mono" style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                        {df.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{
            padding: '14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)'
          }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Sourcing & Off-Take Strategy</h4>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {forecast.recommendedStrategy}
            </p>
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
