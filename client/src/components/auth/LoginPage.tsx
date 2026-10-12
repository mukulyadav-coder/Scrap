import React, { useState, useEffect } from 'react';
import { 
  Recycle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Scale, 
  Leaf, 
  Globe, 
  Phone, 
  X,
  Info,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  onBack?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const { language, setLanguage, setRole, role } = useApp();

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & status states
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ identifier?: boolean; password?: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Modal dialog states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [selectedSignUpRole, setSelectedSignUpRole] = useState<UserRole>('seller');

  // Load remembered identifier if previously saved
  useEffect(() => {
    try {
      const savedIdentifier = localStorage.getItem('kc_saved_identifier');
      if (savedIdentifier) {
        setIdentifier(savedIdentifier);
      }
      const savedRemember = localStorage.getItem('kc_remember_me');
      if (savedRemember !== null) {
        setRememberMe(savedRemember === 'true');
      }
    } catch {
      // ignore storage access issues
    }
  }, []);

  // Real-time validation helper
  const validateField = (field: 'identifier' | 'password', value: string) => {
    const newErrors = { ...errors };

    if (field === 'identifier') {
      const trimmed = value.trim();
      if (!trimmed) {
        newErrors.identifier = language === 'hi' 
          ? 'कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें' 
          : 'Please enter your email or mobile number';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
        const numericOnly = trimmed.replace(/\D/g, '');

        if (!emailRegex.test(trimmed) && !(phoneRegex.test(trimmed) || (numericOnly.length === 10 && /^[6-9]/.test(numericOnly)))) {
          newErrors.identifier = language === 'hi'
            ? 'मान्य ईमेल पता या 10 अंकों का मोबाइल नंबर दर्ज करें'
            : 'Enter a valid email address or 10-digit mobile number';
        } else {
          delete newErrors.identifier;
        }
      }
    }

    if (field === 'password') {
      if (!value) {
        newErrors.password = language === 'hi' 
          ? 'कृपया अपना पासवर्ड दर्ज करें' 
          : 'Please enter your password';
      } else if (value.length < 6) {
        newErrors.password = language === 'hi'
          ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए'
          : 'Password must be at least 6 characters';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIdentifier(val);
    if (touched.identifier) {
      validateField('identifier', val);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      validateField('password', val);
    }
  };

  const handleBlur = (field: 'identifier' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, field === 'identifier' ? identifier : password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ identifier: true, password: true });
    validateField('identifier', identifier);
    validateField('password', password);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numericOnly = identifier.trim().replace(/\D/g, '');
    const isPhone = numericOnly.length === 10 && /^[6-9]/.test(numericOnly);
    const isValidIdentifier = emailRegex.test(identifier.trim()) || isPhone;
    const isValidPassword = password.length >= 6;

    if (!isValidIdentifier || !isValidPassword) {
      return;
    }

    setIsLoading(true);
    setAuthNotice(null);

    // Persist remember me preference
    try {
      if (rememberMe) {
        localStorage.setItem('kc_saved_identifier', identifier.trim());
        localStorage.setItem('kc_remember_me', 'true');
      } else {
        localStorage.removeItem('kc_saved_identifier');
        localStorage.setItem('kc_remember_me', 'false');
      }
    } catch {
      // ignore storage access issues
    }

    // Since the project does not have a live /api/login endpoint in the backend,
    // we clearly state this transparently to the user as requested, while validating UI.
    setTimeout(() => {
      setIsLoading(false);
      setAuthNotice(
        language === 'hi'
          ? 'सत्यापन सफल रहा! (नोट: कबाड़ीवाला कनेक्ट 2026 प्रोटोटाइप में लाइव बैकएंड ऑथेंटिकेशन अभी एकीकृत नहीं है। आप नीचे दिए गए बटन से सीधे प्लेटफॉर्म में प्रवेश कर सकते हैं।)'
          : 'Inputs verified successfully! (Note: Live backend authentication endpoints are not yet connected in this 2026 demo environment. You can proceed directly into the platform.)'
      );
    }, 700);
  };

  // Demo autofill shortcut
  const handleAutofillDemo = (demoRole: UserRole, email: string) => {
    setRole(demoRole);
    setIdentifier(email);
    setPassword('Kabadiwala2026!');
    setTouched({ identifier: true, password: true });
    setErrors({});
    setAuthNotice(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row antialiased selection:bg-emerald-100 selection:text-forest-900">
      
      {/* ======================================================== */}
      {/* LEFT PANEL: Brand, Storytelling & Trust Highlights       */}
      {/* ======================================================== */}
      <div className="relative w-full lg:w-1/2 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden shadow-2xl">
        
        {/* Subtle decorative background shapes and gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Top bar: Back button & Language selector */}
        <div className="relative z-10 flex items-center justify-between mb-8 sm:mb-12">
          {onBack ? (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-forest-100 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all duration-200"
              title="Return to marketplace dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'वापस जाएं' : 'Back to Platform'}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-forest-100 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all duration-200"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'en' ? 'हिन्दी में देखें' : 'English'}</span>
          </button>
        </div>

        {/* Brand & Main Narrative */}
        <div className="relative z-10 space-y-8 my-auto max-w-xl">
          
          {/* Brand Logo and Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/25">
              <div className="w-full h-full bg-forest-950/80 backdrop-blur-xs rounded-[14px] flex items-center justify-center text-emerald-400">
                <Recycle className="w-6 h-6 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Kabadiwala<span className="text-emerald-400">Connect</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  2026
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-300 tracking-wide uppercase mt-0.5">
                “Turn Waste Into Worth.”
              </p>
            </div>
          </div>

          {/* Headline & Narrative */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Waste Less. <br className="hidden sm:inline" />
              Earn More. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-mint-100 to-emerald-400">
                Live Greener.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-forest-100/90 leading-relaxed font-normal">
              Connect with trusted recyclers, local kabadiwalas, and bulk buyers to build a cleaner, greener future. 
              Our smart digital marketplace brings transparent on-site weighing, verified daily mandi rates, and certified environmental recycling right to your doorstep.
            </p>
          </div>

          {/* Visual Environmental Graphic (CSS + SVG) */}
          <div className="relative p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner overflow-hidden">
            <div className="flex items-center justify-between text-xs text-forest-200 mb-3 border-b border-white/10 pb-2">
              <span className="font-semibold flex items-center gap-1.5 text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Live Circular Network
              </span>
              <span className="text-[11px] font-mono text-emerald-300/80">Delhi-NCR Mandis</span>
            </div>

            {/* Circular Economy Flow Diagram */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2.5 rounded-xl bg-forest-900/60 border border-white/5 space-y-1">
                <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="font-bold text-white">1. Sell Waste</div>
                <div className="text-[10px] text-forest-200">Doorstep Pickup</div>
              </div>

              <div className="p-2.5 rounded-xl bg-forest-900/60 border border-white/5 space-y-1">
                <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <Scale className="w-4 h-4" />
                </div>
                <div className="font-bold text-white">2. Weigh & Pay</div>
                <div className="text-[10px] text-forest-200">Fair Mandi Rates</div>
              </div>

              <div className="p-2.5 rounded-xl bg-forest-900/60 border border-white/5 space-y-1">
                <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <Recycle className="w-4 h-4" />
                </div>
                <div className="font-bold text-white">3. Circular Cycle</div>
                <div className="text-[10px] text-forest-200">SPCB-Certified</div>
              </div>
            </div>

            {/* Metric pill */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-forest-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CO₂ Diverted This Month:
              </span>
              <span className="font-bold text-emerald-300">32.4+ Metric Tons</span>
            </div>
          </div>

          {/* Three Compact Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 shrink-0 flex items-center justify-center text-emerald-300">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">Easy Scrap Pickup</div>
                <div className="text-[11px] text-forest-200 mt-0.5 leading-snug">
                  Verified collectors at your preferred doorstep slot.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 shrink-0 flex items-center justify-center text-emerald-300">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">Fair & Transparent</div>
                <div className="text-[11px] text-forest-200 mt-0.5 leading-snug">
                  Tamper-proof scales & daily benchmark prices.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 shrink-0 flex items-center justify-center text-emerald-300">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">Sustainable Recycling</div>
                <div className="text-[11px] text-forest-200 mt-0.5 leading-snug">
                  100% trace-to-recycler compliance & e-waste rules.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center gap-3 text-xs text-forest-200">
          <div className="flex -space-x-2">
            <span className="w-7 h-7 rounded-full ring-2 ring-forest-900 bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">RS</span>
            <span className="w-7 h-7 rounded-full ring-2 ring-forest-900 bg-forest-700 flex items-center justify-center text-[10px] font-bold text-white">RP</span>
            <span className="w-7 h-7 rounded-full ring-2 ring-forest-900 bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">VS</span>
          </div>
          <span>Trusted by 12,500+ households & 450+ verified collectors across Delhi-NCR.</span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT PANEL: Modern Authentication Form                  */}
      {/* ======================================================== */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16">
        
        <div className="w-full max-w-md space-y-6">
          
          {/* Form Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-mint-50 text-forest-800 border border-forest-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'hi' ? 'कबाड़ीवाला कनेक्ट लॉगिन' : 'Kabadiwala Connect Login'}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'hi' ? 'वापसी पर स्वागत है' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-slate-500">
              {language === 'hi' 
                ? 'अपनी सस्टेनेबल रीसाइक्लिंग यात्रा जारी रखने के लिए साइन इन करें।' 
                : 'Sign in to continue your sustainable journey.'}
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Banner (Helpful for reviewers & testers) */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3 text-emerald-600" />
                Quick Demo Role Fill:
              </span>
              <span className="text-[10px] text-slate-400">1-Click Test</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleAutofillDemo('seller', 'rahul.sharma@example.com')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                  role === 'seller' 
                    ? 'bg-forest-800 text-white border-forest-900 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-forest-300 hover:bg-forest-50'
                }`}
                title="Fill Rahul Sharma (Seller)"
              >
                👤 Seller
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo('kabadiwala', 'ramvilas.scrap@gmail.com')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                  role === 'kabadiwala' 
                    ? 'bg-forest-800 text-white border-forest-900 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-forest-300 hover:bg-forest-50'
                }`}
                title="Fill Ramvilas (Kabadiwala)"
              >
                🚴 Collector
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo('bulk_buyer', 'procurement@apexrecyclers.in')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                  role === 'bulk_buyer' 
                    ? 'bg-forest-800 text-white border-forest-900 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-forest-300 hover:bg-forest-50'
                }`}
                title="Fill Apex Recyclers (Bulk Buyer)"
              >
                🏭 Bulk
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo('admin', 'admin@kabadiwalaconnect.in')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                  role === 'admin' 
                    ? 'bg-forest-800 text-white border-forest-900 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-forest-300 hover:bg-forest-50'
                }`}
                title="Fill Admin"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Form Element */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            
            {/* Email or Mobile Number Input */}
            <div className="space-y-1.5">
              <label 
                htmlFor="login-identifier" 
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                {language === 'hi' ? 'ईमेल या मोबाइल नंबर' : 'Email or Mobile Number'}
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {identifier.includes('@') ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <Phone className="w-4 h-4" />
                  )}
                </div>
                
                <input
                  id="login-identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  onBlur={() => handleBlur('identifier')}
                  placeholder={language === 'hi' ? 'उदा. rahul@example.com या 9810123456' : 'e.g. rahul@example.com or 9810123456'}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150 border bg-white ${
                    errors.identifier && touched.identifier
                      ? 'border-red-400 ring-2 ring-red-100 text-slate-900 focus:border-red-500 focus:outline-none'
                      : 'border-slate-200 hover:border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none'
                  }`}
                  aria-invalid={Boolean(errors.identifier && touched.identifier)}
                  aria-describedby={errors.identifier && touched.identifier ? 'identifier-error' : undefined}
                />
              </div>

              {errors.identifier && touched.identifier && (
                <p id="identifier-error" className="text-xs text-red-600 flex items-center gap-1.5 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.identifier}</span>
                </p>
              )}
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="login-password" 
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-forest-700 hover:text-forest-900 transition-colors focus:outline-none"
                >
                  {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  placeholder={language === 'hi' ? 'अपना पासवर्ड दर्ज करें' : 'Enter your password'}
                  className={`w-full pl-10 pr-11 py-3 rounded-2xl text-sm font-medium transition-all duration-150 border bg-white ${
                    errors.password && touched.password
                      ? 'border-red-400 ring-2 ring-red-100 text-slate-900 focus:border-red-500 focus:outline-none'
                      : 'border-slate-200 hover:border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none'
                  }`}
                  aria-invalid={Boolean(errors.password && touched.password)}
                  aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.password && touched.password && (
                <p id="password-error" className="text-xs text-red-600 flex items-center gap-1.5 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    rememberMe 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}>
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-600">
                  {language === 'hi' ? 'मुझे याद रखें' : 'Remember Me'}
                </span>
              </label>
            </div>

            {/* Status / Authentication Notice */}
            {authNotice && (
              <div className="p-3.5 rounded-2xl bg-mint-50 border border-emerald-200 text-xs text-forest-900 space-y-2 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{authNotice}</p>
                </div>
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full py-2 px-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{language === 'hi' ? 'प्लेटफ़ॉर्म डैशबोर्ड खोलें' : 'Enter Platform Dashboard'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Prominent Emerald Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'hi' ? 'सत्यापन हो रहा है...' : 'Verifying...'}</span>
                </>
              ) : (
                <>
                  <span>{language === 'hi' ? 'साइन इन करें' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white px-3 text-slate-400 font-semibold">
                {language === 'hi' ? 'या जारी रखें' : 'OR CONTINUE WITH'}
              </span>
            </div>
          </div>

          {/* Explore as Guest / Instant Role Access */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <span>{language === 'hi' ? 'अतिथि के रूप में अन्वेषण करें (लाइव डेमो)' : 'Explore as Guest (Live 2026 Demo)'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {/* Sign Up Link */}
          <div className="text-center text-xs text-slate-500 pt-2">
            <span>{language === 'hi' ? 'कबाड़ीवाला कनेक्ट पर नए हैं?' : 'New to Kabadiwala Connect?'}{' '}</span>
            <button
              type="button"
              onClick={() => setShowSignUpModal(true)}
              className="font-bold text-forest-800 hover:text-emerald-600 transition-colors underline-offset-2 hover:underline focus:outline-none"
            >
              {language === 'hi' ? 'खाता बनाएं' : 'Create an account.'}
            </button>
          </div>

          {/* Legal / Policy Footer */}
          <div className="text-center text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-4">
            {language === 'hi' ? (
              <>
                जारी रखकर, आप हमारे सेवा की शर्तें और गोपनीयता नीति से सहमत होते हैं।
              </>
            ) : (
              <>
                By continuing, you agree to our{' '}
                <span className="text-slate-600 font-medium hover:underline cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-slate-600 font-medium hover:underline cursor-pointer">Privacy Policy</span>.
              </>
            )}
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL: Forgot Password Dialog                            */}
      {/* ======================================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-forest-900 font-bold text-sm">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'पासवर्ड रीसेट करें' : 'Reset Password'}</span>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSubmitted(false);
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-mint-50 text-emerald-600 flex items-center justify-center mx-auto border border-forest-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'hi' ? 'रीसेट लिंक भेजा गया!' : 'Reset Link Sent!'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'hi'
                    ? `हमने ${forgotEmail || 'आपके पंजीकृत पते'} पर पासवर्ड रीसेट लिंक भेजा है। कृपया अपना इनबॉक्स जांचें।`
                    : `We sent a password reset link to ${forgotEmail || 'your registered contact'}. Please check your inbox or SMS.`}
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-forest-800 text-white font-bold text-xs"
                >
                  {language === 'hi' ? 'लॉगिन पर वापस आएं' : 'Back to Login'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'hi'
                    ? 'अपना पंजीकृत ईमेल या फोन दर्ज करें। हम आपको एक सुरक्षित सत्यापन लिंक भेजेंगे।'
                    : 'Enter your registered email address or mobile phone. We will send you a secure verification link to reset your password.'}
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {language === 'hi' ? 'ईमेल या मोबाइल' : 'Email or Mobile'}
                  </label>
                  <input
                    type="text"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com or 9810123456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSubmitted(true)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs"
                  >
                    {language === 'hi' ? 'लिंक भेजें' : 'Send Reset Link'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Create Account / Registration Guide               */}
      {/* ======================================================== */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-mint-50 flex items-center justify-center text-forest-800">
                  <Recycle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'hi' ? 'नया खाता बनाएं' : 'Create an Account'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'अपनी उपयुक्त भूमिका चुनें' : 'Select your primary role in the ecosystem'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSignUpModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Role Options */}
            <div className="space-y-2">
              {[
                {
                  id: 'seller' as UserRole,
                  title: language === 'hi' ? 'कबाड़ विक्रेता (Seller)' : 'Waste Seller',
                  desc: 'Household, shop, or office wanting doorstep scrap collection and best prices.',
                  icon: '👤'
                },
                {
                  id: 'kabadiwala' as UserRole,
                  title: language === 'hi' ? 'कबाड़ीवाला (Collector)' : 'Local Kabadiwala',
                  desc: 'Doorstep scrap collector looking for nearby scrap listings and bulk deals.',
                  icon: '🚴'
                },
                {
                  id: 'bulk_buyer' as UserRole,
                  title: language === 'hi' ? 'थोक खरीदार (Bulk Buyer)' : 'Industrial Recycler',
                  desc: 'Factory or aggregator procuring high-volume verified recyclables.',
                  icon: '🏭'
                }
              ].map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedSignUpRole(r.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedSignUpRole === r.id
                      ? 'border-emerald-500 bg-mint-50 ring-2 ring-emerald-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{r.icon}</span>
                      <span className="text-xs font-bold text-slate-900">{r.title}</span>
                    </div>
                    {selectedSignUpRole === r.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 pl-7">{r.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-forest-800">Demo Note:</span> In this 2026 prototype, new registrations automatically receive verified demo profiles. You can test this persona immediately.
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowSignUpModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                {language === 'hi' ? 'रद्द करें' : 'Close'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole(selectedSignUpRole);
                  setShowSignUpModal(false);
                  if (onBack) onBack();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs"
              >
                {language === 'hi' ? 'इस भूमिका से शुरू करें' : 'Start with this Role'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

