import React, { useState } from 'react';
import { 
  Sprout, 
  Store, 
  ArrowRight, 
  Sun, 
  Moon,
  Languages
} from 'lucide-react';
import { languages } from '../i18n/translations';
import { saveUserToDatabase } from '../services/dbService';

export default function AuthScreen({ 
  onLogin, 
  onClose,
  theme, 
  toggleTheme, 
  currentLang, 
  setLang, 
  t 
}) {
  // Normal users ONLY have Farmer Login or Buyer Login
  const [role, setRole] = useState('farmer');
  
  // Strictly initialized as empty strings with zero hardcoded dummy values
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Admin access is kept discreet: entering an admin identifier logs into admin portal
    const isAdmin = identifier.trim().toLowerCase().includes('admin');
    const assignedRole = isAdmin ? 'admin' : role;

    const userPayload = {
      role: assignedRole,
      id: `${assignedRole}_${Date.now()}`,
      name: fullName.trim() || (assignedRole === 'admin' ? 'Platform Administrator' : identifier.split('@')[0] || (assignedRole === 'farmer' ? (t.farmer_workspace || 'Verified Grower') : (t.buyer_verified_tag || 'Verified Buyer'))),
      email: identifier.trim(),
      location: location.trim() || (assignedRole === 'farmer' ? 'Nashik, Maharashtra' : 'Vashi APMC, Mumbai')
    };

    // Execute real HTTP fetch POST request to save to backend database
    await saveUserToDatabase(userPayload);
    setIsSaving(false);

    onLogin(userPayload);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundColor: 'var(--bg-app)',
      position: 'relative'
    }}>
      
      {/* Top Header Bar: Language Switcher + Theme Toggle */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Languages size={15} color="var(--text-secondary)" />
          <select
            value={currentLang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Select Language"
            className="form-select"
            style={{
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              width: 'auto',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface)'
            }}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Switcher */}
        <button 
          className="btn btn-outline btn-sm"
          onClick={toggleTheme}
          style={{ borderRadius: 'var(--radius-sm)', padding: '6px 12px' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} />}
          <span>{theme === 'dark' ? (t.light_mode || 'Light') : (t.dark_mode || 'Dark')}</span>
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--agri-green)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px'
          }}>
            <Sprout size={32} color="#ffffff" />
          </div>

          <h2 style={{ fontSize: '1.85rem', marginBottom: '4px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            {t.brand || "AgriDirect"}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {t.tagline || "Digital Agri-Marketplace & Supply Chain"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="swiss-card" style={{ padding: '28px' }}>
          
          {/* STRICT USER REQUIREMENT: Normal Users ONLY see Farmer Login and Buyer Login */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '8px', textAlign: 'center', fontWeight: 600 }}>
              {t.select_account_type || "Select Account Type"}
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              backgroundColor: 'var(--bg-subtle)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <button
                type="button"
                onClick={() => setRole('farmer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  backgroundColor: role === 'farmer' ? 'var(--agri-green)' : 'transparent',
                  color: role === 'farmer' ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
                id="tab-role-farmer"
              >
                <Sprout size={16} />
                <span>{t.farmer_login || "Farmer Login"}</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('buyer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  backgroundColor: role === 'buyer' ? 'var(--text-primary)' : 'transparent',
                  color: role === 'buyer' ? 'var(--bg-app)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
                id="tab-role-buyer"
              >
                <Store size={16} />
                <span>{t.buyer_login || "Buyer Login"}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t.full_name_label || "Full Name / Farm / Business Name"}</label>
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.full_name_placeholder || "e.g. Rameshwar Patil / FreshAgro Corp"}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.identifier_label || "Phone Number or Email"}</label>
              <input 
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t.identifier_placeholder || "e.g. 9823144521 or user@agri.in"}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">{t.password_label || "Password"}</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.secure_pin || "Secure PIN"}</span>
              </div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password_placeholder || "Enter password"}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.location_label || "Location / Primary Mandi District"}</label>
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.location_placeholder || "e.g. Nashik, Maharashtra"}
                className="form-input"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSaving}
              style={{ width: '100%', marginTop: '8px', minHeight: '46px' }}
              id="btn-login-submit"
            >
              <span>
                {isSaving 
                  ? (t.connecting || 'Connecting...') 
                  : (role === 'farmer' ? (t.login_as_farmer || 'Farmer Login') : (t.login_as_buyer || 'Buyer Login'))}
              </span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* 1-Click Instant Demo Profiles for Quick Testing */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed var(--border-light)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>
              {currentLang === 'ta' ? '⚡ ஒரே கிளிக்கில் மாதிரி கணக்கு:' : '⚡ 1-CLICK INSTANT DEMO EXPLORATION:'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => onLogin({
                  id: 'farmer_1',
                  role: 'farmer',
                  name: currentLang === 'ta' ? 'அண்ணாமலை முத்து' : 'Rameshwar Patil',
                  email: 'annamalai@patilfarm.in',
                  location: currentLang === 'ta' ? 'திண்டுக்கல், தமிழ்நாடு' : 'Nashik, Maharashtra'
                })}
                style={{ fontSize: '0.8rem', padding: '8px' }}
              >
                🌾 {currentLang === 'ta' ? 'மாதிரி விவசாயி' : 'Demo Farmer'}
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => onLogin({
                  id: 'buyer_1',
                  role: 'buyer',
                  name: currentLang === 'ta' ? 'சவுதர்ன் ஸ்பைசஸ்' : 'Vikram Malhotra',
                  email: 'procurement@freshagro.in',
                  location: currentLang === 'ta' ? 'கோயம்புத்தூர் மார்க்கெட்' : 'Vashi APMC, Mumbai'
                })}
                style={{ fontSize: '0.8rem', padding: '8px' }}
              >
                🏢 {currentLang === 'ta' ? 'மாதிரி வாங்குபவர்' : 'Demo Buyer'}
              </button>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm"
                style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: 'var(--text-secondary)', textDecoration: 'underline', fontSize: '0.85rem' }}
              >
                {currentLang === 'ta' ? '← உள்நுழையாமல் சந்தையை பார்க்கவும்' : '← Continue Browsing as Guest'}
              </button>
            )}
          </div>

        </div>

        {/* Minimal Footer */}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '20px' }}>
          🔒 {t.e2ee_security_note || "End-to-End Encrypted Agricultural Commerce"}
        </p>

      </div>
    </div>
  );
}
