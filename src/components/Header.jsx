import { 
  Sprout, 
  Languages, 
  User, 
  Store, 
  ShieldAlert, 
  TrendingUp, 
  BarChart3, 
  Truck, 
  LogOut, 
  LogIn,
  Sun, 
  Moon,
  HelpCircle,
  Volume2,
  Leaf
} from 'lucide-react';
import { languages } from '../i18n/translations';

export default function Header({ 
  user,
  onLogout,
  onOpenAuth,
  theme,
  toggleTheme,
  currentLang, 
  setLang, 
  t,
  onOpenPriceLab,
  onOpenDemandRadar,
  onOpenSupplyChain,
  onOpenOnboarding
}) {
  const roleBadgeClass = user?.role === 'farmer' ? 'tag-green' : user?.role === 'buyer' ? 'tag-crypto' : 'tag-amber';

  return (
    <header style={{
      backgroundColor: 'var(--color-deep-green)',
      borderBottom: '3px solid var(--color-warm-orange)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 0',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        
        {/* Brand & Clean Solid Agriculture Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--color-warm-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sprout size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#ffffff'
              }}>
                {t.brand || "AgriDirect"}
              </span>
              <span style={{
                fontSize: '0.625rem',
                padding: '2px 7px',
                backgroundColor: 'var(--color-warm-orange)',
                color: '#ffffff',
                fontWeight: 800,
                borderRadius: 'var(--radius-xs)',
                letterSpacing: '0.04em'
              }}>
                MANDI DIRECT
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: '#cce2d4', margin: 0, fontWeight: 500 }}>
              {user?.role === 'farmer' 
                ? (t.edition_farmer || 'Grower Enterprise Edition') 
                : user?.role === 'buyer' 
                  ? (t.edition_buyer || 'Institutional Sourcing Hub') 
                  : (t.edition_admin || 'Platform Oversight Directorate')}
            </p>
          </div>
        </div>

        {/* Agricultural Market Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-sm"
            onClick={() => {
              const speakGreeting = currentLang === 'ta'
                ? "வணக்கம்ங்க! நான் உங்கள் வானிஸ்ரீ! அக்ரிடைரக்ட் உழவர் சந்தைக்கு உங்களை அன்போடு வரவேற்கிறேன். பயிர் மண்டி விலை அல்லது நேரடி கொள்முதல் பத்தி என்கிட்ட கேளுங்க!"
                : "Hello! Welcome to AgriDirect. How may I assist you with crop mandi rates, verified farmer lots, or farm-gate logistics?";
              window.dispatchEvent(new CustomEvent('agri-voice-speak', { 
                detail: { text: speakGreeting } 
              }));
            }}
            title={currentLang === 'ta' ? "வானிஸ்ரீயின் குரல் வழிகாட்டி" : "Listen to Agricultural Audio Guide"}
            style={{
              fontWeight: 700,
              color: '#ffffff',
              backgroundColor: 'var(--color-warm-orange)',
              borderColor: 'var(--color-warm-orange)',
              borderRadius: 'var(--radius-sm)'
            }}
            id="btn-nav-tara-voice"
          >
            <Volume2 size={14} color="#ffffff" />
            <span>{currentLang === 'ta' ? 'வானிஸ்ரீ வழிகாட்டி' : (t.voice_guide || 'Audio Guide')}</span>
          </button>

          <button 
            className="btn btn-sm"
            onClick={onOpenOnboarding}
            title="Getting Started Onboarding Guide"
            style={{
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-sm)'
            }}
            id="btn-nav-guide"
          >
            <HelpCircle size={14} color="#ffffff" />
            <span>{t.guide || "Guide"}</span>
          </button>

          <button 
            className="btn btn-sm"
            onClick={onOpenPriceLab}
            title="APMC Mandi Price Benchmark"
            style={{
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-sm)'
            }}
            id="btn-nav-price-lab"
          >
            <TrendingUp size={14} color="#ffffff" />
            <span>{t.price_lab || "Price Benchmark"}</span>
          </button>

          <button 
            className="btn btn-sm"
            onClick={onOpenDemandRadar}
            title="Market Demand Trends"
            style={{
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-sm)'
            }}
            id="btn-nav-demand-radar"
          >
            <BarChart3 size={14} color="#ffffff" />
            <span>{t.demand_radar || "Market Demand"}</span>
          </button>

          <button 
            className="btn btn-sm"
            onClick={onOpenSupplyChain}
            title="Supply Chain & Logistics"
            style={{
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-sm)'
            }}
            id="btn-nav-logistics"
          >
            <Truck size={14} color="#ffffff" />
            <span>{t.logistics_route || "Logistics"}</span>
          </button>
        </div>

        {/* Right Section: Theme Toggle, Language, User Chip & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-sm"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff'
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            id="btn-theme-toggle"
          >
            {theme === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#ffffff" />}
          </button>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Languages size={15} color="#ffffff" />
            <select
              value={currentLang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select Language"
              className="form-select"
              style={{
                padding: '5px 8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                width: 'auto',
                backgroundColor: '#ffffff',
                color: 'var(--color-charcoal)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
              id="select-language"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} style={{ color: '#1f2421' }}>
                  {l.native}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile Chip or Guest Sign In */}
          {user ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--color-warm-orange)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.2, color: '#ffffff' }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: '0.625rem', color: '#cce2d4', textTransform: 'uppercase', fontWeight: 600 }}>
                    {user.role === 'farmer' ? (t.farmer_workspace || 'Farmer') : user.role === 'buyer' ? (t.buyer_verified_tag || 'Buyer') : 'Admin'}
                  </span>
                </div>
              </div>

              {/* Sign Out Button */}
              <button 
                className="btn btn-sm"
                onClick={onLogout}
                title="Sign out of platform"
                style={{
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: 'var(--radius-sm)'
                }}
                id="btn-sign-out"
              >
                <LogOut size={14} color="#ffffff" />
                <span>{t.sign_out || "Sign Out"}</span>
              </button>
            </>
          ) : (
            <button 
              className="btn btn-sm"
              onClick={onOpenAuth}
              style={{
                borderRadius: 'var(--radius-sm)',
                padding: '6px 14px',
                fontWeight: 700,
                backgroundColor: 'var(--color-warm-orange)',
                color: '#ffffff',
                border: '1px solid var(--color-warm-orange)'
              }}
              id="btn-guest-login"
            >
              <LogIn size={14} color="#ffffff" />
              <span>{currentLang === 'ta' ? 'உள்நுழைவு / பதிவு' : (t.login_as_farmer || "Sign In / Register")}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
