import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, Language } from '../../types';
import { 
  Recycle, 
  Globe, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  User as UserIcon, 
  Sparkles,
  Menu,
  X,
  LogIn
} from 'lucide-react';

export const Header: React.FC<{ onMenuToggle?: () => void; isSidebarOpen?: boolean }> = ({ 
  onMenuToggle, 
  isSidebarOpen 
}) => {
  const { 
    role, 
    setRole, 
    setActiveTab,
    language, 
    setLanguage, 
    currentUser, 
    resetDemoData, 
    t 
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const rolesList: { id: UserRole; label: string; icon: string; desc: string }[] = [
    { id: 'seller', label: language === 'hi' ? 'विक्रेता (Seller)' : 'Seller', icon: '👤', desc: 'Household / Office' },
    { id: 'kabadiwala', label: language === 'hi' ? 'कबाड़ीवाला (Collector)' : 'Kabadiwala', icon: '🚴', desc: 'Doorstep Scrap Buyer' },
    { id: 'bulk_buyer', label: language === 'hi' ? 'थोक खरीदार (Bulk)' : 'Bulk Buyer', icon: '🏭', desc: 'Industrial Aggregator' },
    { id: 'admin', label: language === 'hi' ? 'एडमिन (Admin)' : 'Admin', icon: '🛡️', desc: 'Platform Governance' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Recycle className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-forest-900 flex items-center gap-1.5">
                  Kabadiwala<span className="text-emerald-500">Connect</span>
                  <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-forest-100 text-forest-800 border border-forest-200">
                    2026
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 hidden sm:block -mt-0.5">
                  {t.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Role Switcher Quick Pill Bar (Desktop) */}
          <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 shadow-inner">
            <span className="text-[11px] font-semibold text-slate-500 px-2.5 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              {t.nav.switchRole}:
            </span>
            {rolesList.map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-forest-800 text-white shadow-sm shadow-forest-900/30 font-bold scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Role menu on mobile, Language, Reset, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Mobile Role Switcher Button */}
            <div className="relative lg:hidden">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold"
              >
                <span>{rolesList.find(r => r.id === role)?.icon}</span>
                <span className="capitalize">{role.replace('_', ' ')}</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-slate-200 p-2 z-50">
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    {t.roleSelectorTitle}
                  </div>
                  {rolesList.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRole(r.id);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        role === r.id ? 'bg-forest-100 text-forest-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{r.icon}</span>
                        <span>{r.label}</span>
                      </div>
                      {role === r.id && <CheckCircle2 className="w-3.5 h-3.5 text-forest-800" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Toggle (EN / HI) */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-forest-800 bg-white border border-slate-200 hover:border-forest-300 transition-all shadow-xs"
              title="Toggle English / Hindi"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold">{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={resetDemoData}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Reset Demo Data to Initial Seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Reset Demo</span>
            </button>

            {/* Sign In Navigation Button */}
            <button
              onClick={() => {
                setActiveTab('login');
                window.location.hash = 'login';
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-forest-800 bg-forest-50 hover:bg-forest-100 border border-forest-200 hover:border-forest-300 transition-all shadow-xs"
              title="Open Kabadiwala Connect Login Page"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? 'लॉगिन' : 'Sign In'}</span>
            </button>

            {/* User Profile Avatar & Badge */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-2 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-xs"
              >
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                    {currentUser.name}
                    {currentUser.isVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize leading-none">
                    {currentUser.businessName ? currentUser.businessName : currentUser.locality}
                  </div>
                </div>
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-forest-100"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-lg border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        {currentUser.name}
                        {currentUser.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                      <div className="text-[11px] text-slate-500">{currentUser.phone}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.2 text-[9px] font-bold rounded-full bg-forest-100 text-forest-800">
                        {currentUser.role.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between py-1 px-2 rounded-lg bg-mint-50 border border-forest-100">
                      <span className="text-forest-900 font-medium">Recycled Volume:</span>
                      <span className="font-bold text-forest-800">{currentUser.greenScoreKg} kg</span>
                    </div>
                    <div className="px-2 py-1 text-[11px] text-slate-500">
                      📍 {currentUser.address}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        window.location.hash = 'login';
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-lg text-forest-800 hover:bg-forest-50 font-semibold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                        {language === 'hi' ? 'लॉगिन पेज पर जाएं' : 'Go to Login Page'}
                      </span>
                      <span className="text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">NEW</span>
                    </button>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          resetDemoData();
                          setShowProfileMenu(false);
                        }}
                        className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px]"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset Demo
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">MVP Demo v2.6</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

