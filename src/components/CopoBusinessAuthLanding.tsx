import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Code, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Copy, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  Globe, 
  RefreshCw, 
  Lock, 
  ArrowLeft, 
  QrCode, 
  Video, 
  TrendingUp, 
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Place, NavSection } from '../types';
import { BusinessSession } from './CopoBusinessClaimModal';

interface CopoBusinessAuthLandingProps {
  onNavigate: (section: NavSection) => void;
  places: Place[];
  onSuccessAuth: (session: BusinessSession) => void;
  initialPlace?: Place | null;
  initialMode?: 'signin' | 'claim' | 'demo';
}

export const CopoBusinessAuthLanding: React.FC<CopoBusinessAuthLandingProps> = ({
  onNavigate,
  places,
  onSuccessAuth,
  initialPlace = null,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'claim' | 'demo'>(initialMode || 'signin');
  
  // Selected place for claim
  const [selectedPlace, setSelectedPlace] = useState<Place>(() => {
    if (initialPlace) return initialPlace;
    if (places && places.length > 0) return places[0];
    return {
      id: 'place-rustic-spoon',
      name: 'The Rustic Spoon',
      address: '123 Main St, New York, NY 10001',
      category: 'Italian & Artisanal Bakery',
      categoryType: 'restaurants',
      city: 'New York',
      rating: 4.9,
      totalReviews: 42,
      reviewCount: 42,
      lat: 40.7128,
      lng: -74.0060,
      website: 'https://therusticspoon-nyc.com',
      avatarUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      photos: [],
      ratingDistribution: { stars5: 35, stars4: 5, stars3: 2, stars2: 0, stars1: 0 }
    } as unknown as Place;
  });

  // Sync if initialPlace or initialMode changes
  React.useEffect(() => {
    if (initialPlace) {
      setSelectedPlace(initialPlace);
      if (initialPlace.website) setWebsiteUrl(initialPlace.website);
    }
  }, [initialPlace]);

  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  const [claimSearch, setClaimSearch] = useState('');
  const [claimTab, setClaimTab] = useState<'email' | 'meta_tag'>('email');

  // Email Magic Link State
  const [businessEmail, setBusinessEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Meta Tag State
  const [websiteUrl, setWebsiteUrl] = useState(selectedPlace.website || '');
  const [isCheckingTag, setIsCheckingTag] = useState(false);
  const [copiedTag, setCopiedTag] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [tagSuccess, setTagSuccess] = useState(false);

  const expectedTagString = `<meta name="yoouz-verification" content="verify_${selectedPlace.id || 'business'}" />`;

  // Send Magic Link via Resend
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessEmail || !businessEmail.includes('@')) {
      setEmailError('Please enter a valid official business email.');
      return;
    }

    setIsSendingEmail(true);
    setEmailError(null);

    try {
      const response = await fetch('/api/business/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: businessEmail.trim(),
          placeId: selectedPlace.id,
          placeName: selectedPlace.name,
          website: selectedPlace.website || websiteUrl,
          host: window.location.host
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setEmailSentSuccess(true);
        if (data.previewCode) {
          setPreviewCode(data.previewCode);
        }
      } else {
        setEmailError(data.error || 'Failed to send verification email.');
      }
    } catch (err) {
      setEmailError('Network error. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Verify OTP Code
  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setEmailError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifyingCode(true);
    setEmailError(null);

    try {
      const response = await fetch('/api/business/verify-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: businessEmail.trim(),
          code: otpCode.trim(),
          placeId: selectedPlace.id
        })
      });

      const data = await response.json();
      if (response.ok && data.success && data.session) {
        localStorage.setItem('copo_business_verified_session', JSON.stringify(data.session));
        window.dispatchEvent(new CustomEvent('copo_business_auth_changed', { detail: data.session }));
        onSuccessAuth(data.session);
      } else {
        setEmailError(data.error || 'Invalid or expired code.');
      }
    } catch (err) {
      setEmailError('Verification error. Please try again.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Verify Website Meta Tag
  const handleVerifyMetaTag = async () => {
    const url = websiteUrl || selectedPlace.website;
    if (!url) {
      setTagError('Please provide a valid website URL.');
      return;
    }

    setIsCheckingTag(true);
    setTagError(null);
    setTagSuccess(false);

    try {
      const response = await fetch('/api/business/verify-website-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: selectedPlace.id,
          website: url,
          expectedTag: `verify_${selectedPlace.id || 'business'}`
        })
      });

      const data = await response.json();
      if (response.ok && data.verified) {
        setTagSuccess(true);
        const session: BusinessSession = {
          businessEmail: `verified_webmaster@${url.replace(/^https?:\/\//, '').split('/')[0]}`,
          placeId: selectedPlace.id,
          placeName: selectedPlace.name,
          verifiedAt: new Date().toISOString(),
          role: 'business_owner',
          verificationMethod: 'website_meta_tag',
          token: `biz_tag_${Date.now()}`
        };

        localStorage.setItem('copo_business_verified_session', JSON.stringify(session));
        window.dispatchEvent(new CustomEvent('copo_business_auth_changed', { detail: session }));
        setTimeout(() => {
          onSuccessAuth(session);
        }, 1000);
      } else {
        setTagError(data.message || 'Meta tag was not found in your homepage <head>.');
      }
    } catch (err) {
      setTagError('Unable to reach website server.');
    } finally {
      setIsCheckingTag(false);
    }
  };

  // Instant Demo Sign In
  const handleLaunchDemo = (placeChoice: 'rustic' | 'ups') => {
    const place = placeChoice === 'rustic' 
      ? (places.find(p => p.id === 'place-rustic-spoon') || places[0])
      : (places.find(p => p.name.toLowerCase().includes('ups') || p.website?.includes('ups.com')) || places[0]);

    const session: BusinessSession = {
      businessEmail: placeChoice === 'rustic' ? 'owner@therusticspoon.com' : 'merchant@ups.com',
      placeId: place ? place.id : 'place-rustic-spoon',
      placeName: place ? place.name : (placeChoice === 'rustic' ? 'The Rustic Spoon' : 'ups.com'),
      verifiedAt: new Date().toISOString(),
      role: 'business_owner',
      verificationMethod: 'resend_email_magic_link',
      token: `biz_demo_${Date.now()}`
    };

    localStorage.setItem('copo_business_verified_session', JSON.stringify(session));
    window.dispatchEvent(new CustomEvent('copo_business_auth_changed', { detail: session }));
    onSuccessAuth(session);
  };

  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(claimSearch.toLowerCase()) || 
    p.address.toLowerCase().includes(claimSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#f8fafd] flex flex-col antialiased text-zinc-900">
      
      {/* 1. Sleek Enterprise Top Bar */}
      <header className="w-full h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between shadow-2xs shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1a73e8] shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform text-white">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-zinc-900 font-['Google_Sans',sans-serif]">Yoouz</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-bold uppercase tracking-wider border border-zinc-200/80">
                Business Portal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleLaunchDemo('rustic')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1a73e8] border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Interactive Demo</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Feed</span>
          </button>
        </div>
      </header>

      {/* 2. Main Hero & Interactive Sign-In/Claim Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        
        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1a73e8] text-xs font-bold mb-4 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Corporate Domain & Email Authentication via Resend API</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-3">
            Manage your verified business on Yoouz
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            Monitor authentic 60-second customer video reviews, reply with an official verified owner badge, auto-sync video embeds to your website, and drive direct table bookings.
          </p>
        </div>

        {/* 3 Main Action Modes Tabs */}
        <div className="w-full max-w-xl bg-white p-1 rounded-2xl border border-zinc-200/90 shadow-sm flex mb-6">
          <button
            onClick={() => { setMode('signin'); setEmailError(null); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'signin' 
                ? 'bg-[#1a73e8] text-white shadow-sm' 
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Sign In with Email</span>
          </button>

          <button
            onClick={() => { setMode('claim'); setEmailError(null); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'claim' 
                ? 'bg-[#1a73e8] text-white shadow-sm' 
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Claim Your Venue</span>
          </button>

          <button
            onClick={() => { setMode('demo'); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'demo' 
                ? 'bg-[#1a73e8] text-white shadow-sm' 
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo</span>
          </button>
        </div>

        {/* Action Box Container */}
        <div className="w-full max-w-xl bg-white rounded-3xl border border-zinc-200/90 shadow-xl p-6 sm:p-8 transition-all">
          
          {/* ==================================================== */}
          {/* MODE 1: SIGN IN WITH OFFICIAL BUSINESS EMAIL (RESEND) */}
          {/* ==================================================== */}
          {mode === 'signin' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <span>Sign in to Business Management Suite</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Enter your official business email. We'll send you an instant 1-click magic link and 6-digit verification code.
                </p>
              </div>

              {!emailSentSuccess ? (
                <form onSubmit={handleSendMagicLink} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                      Official Business Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        placeholder="e.g. manager@therusticspoon.com"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 focus:bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#1a73e8] font-medium"
                      />
                    </div>
                  </div>

                  {emailError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{emailError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingEmail || !businessEmail}
                    className="w-full py-3.5 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-zinc-300 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSendingEmail ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending via Resend API...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Send Magic Link & Code (Resend)</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1a73e8]">
                      <Check className="w-4 h-4" />
                      <span>Verification Code Sent via Resend</span>
                    </div>
                    <p className="text-[11.5px] text-zinc-600 leading-relaxed">
                      We dispatched a code to <strong className="text-zinc-900">{businessEmail}</strong>. Enter the 6-digit code below to unlock your portal:
                    </p>
                    {previewCode && (
                      <div className="pt-2 flex items-center justify-between border-t border-blue-200/60">
                        <span className="text-[10px] text-blue-700 font-bold">Demo Mode Test Code:</span>
                        <button
                          type="button"
                          onClick={() => setOtpCode(previewCode)}
                          className="px-2 py-0.5 rounded-md bg-[#1a73e8] text-white text-[10px] font-mono font-bold hover:bg-blue-700 cursor-pointer"
                        >
                          Auto-fill: {previewCode}
                        </button>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleVerifyCode} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        6-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full text-center tracking-[8px] font-mono text-xl py-3 bg-zinc-50 focus:bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#1a73e8] font-bold"
                      />
                    </div>

                    {emailError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{emailError}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEmailSentSuccess(false)}
                        className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isVerifyingCode || otpCode.length < 6}
                        className="flex-1 py-3 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-zinc-300 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isVerifyingCode ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verify & Enter Portal</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* MODE 2: CLAIM / REGISTER A VENUE LISTING */}
          {/* ==================================================== */}
          {mode === 'claim' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <span>Claim & Verify Your Listing</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Select your venue and verify domain ownership via corporate email or HTML meta tag.
                </p>
              </div>

              {/* Selected Venue Preview & Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-700">Select Business Venue</label>
                <div className="relative">
                  <input
                    type="text"
                    value={claimSearch}
                    onChange={(e) => setClaimSearch(e.target.value)}
                    placeholder="Search venue name (e.g. The Rustic Spoon, Levain, UPS)..."
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#1a73e8]"
                  />
                  <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {claimSearch.trim() && (
                  <div className="max-h-36 overflow-y-auto bg-white border border-zinc-200 rounded-xl shadow-md p-1 space-y-1">
                    {filteredPlaces.slice(0, 4).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlace(p);
                          setWebsiteUrl(p.website || '');
                          setClaimSearch('');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 rounded-lg text-xs flex items-center justify-between cursor-pointer"
                      >
                        <div className="truncate">
                          <span className="font-bold text-zinc-900 block truncate">{p.name}</span>
                          <span className="text-[10px] text-zinc-400 block truncate">{p.address}</span>
                        </div>
                        <Check className="w-3.5 h-3.5 text-[#1a73e8]" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                  <div className="truncate">
                    <span className="font-bold text-xs text-zinc-900 block truncate">{selectedPlace.name}</span>
                    <span className="text-[10px] text-zinc-500 block truncate">{selectedPlace.address}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#1a73e8] text-[10px] font-bold shrink-0">
                    Selected
                  </span>
                </div>
              </div>

              {/* Verification Method Subtabs */}
              <div className="flex bg-zinc-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setClaimTab('email')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    claimTab === 'email' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
                  }`}
                >
                  Corporate Email (Resend)
                </button>
                <button
                  type="button"
                  onClick={() => setClaimTab('meta_tag')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    claimTab === 'meta_tag' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
                  }`}
                >
                  Website HTML Meta Tag
                </button>
              </div>

              {claimTab === 'email' ? (
                <form onSubmit={handleSendMagicLink} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Business Domain Email
                    </label>
                    <input
                      type="email"
                      required
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder={`e.g. owner@${selectedPlace.website ? selectedPlace.website.replace(/^https?:\/\//, '').split('/')[0] : 'therusticspoon-nyc.com'}`}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#1a73e8]"
                    />
                  </div>

                  {emailError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                      {emailError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingEmail || !businessEmail}
                    className="w-full py-3 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-zinc-300 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    <span>Dispatch Verification Link</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-600">
                    Add this tag to your website homepage <code className="text-[#1a73e8] font-mono bg-blue-50 px-1 py-0.5 rounded">&lt;head&gt;</code>:
                  </p>
                  
                  <div className="p-3 bg-zinc-900 rounded-xl font-mono text-[11px] text-blue-300 flex items-center justify-between">
                    <span className="truncate">{expectedTagString}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(expectedTagString);
                        setCopiedTag(true);
                        setTimeout(() => setCopiedTag(false), 2000);
                      }}
                      className="ml-2 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-bold shrink-0 cursor-pointer"
                    >
                      {copiedTag ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://therusticspoon-nyc.com"
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#1a73e8]"
                    />
                  </div>

                  {tagError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                      {tagError}
                    </div>
                  )}

                  {tagSuccess && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-bold">
                      Website meta tag verified! Launching dashboard...
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyMetaTag}
                    disabled={isCheckingTag || !websiteUrl}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-300 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isCheckingTag ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    <span>Verify Live Tag</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* MODE 3: 1-CLICK INSTANT DEMO MODE (TRY IT OUT FAST) */}
          {/* ==================================================== */}
          {mode === 'demo' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <span>Try Out the Full Management Suite</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Experience all business features instantly with live analytics, video reviews, widget generator, and QR invite studio.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleLaunchDemo('rustic')}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center font-black text-base shadow-xs">
                      R
                    </div>
                    <div>
                      <div className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                        <span>The Rustic Spoon</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          PRO TIER
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        Italian Dining • 42 Video Reviews • Website Carousel Active
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#1a73e8] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchDemo('ups')}
                  className="w-full p-4 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all text-left flex items-center justify-between group cursor-pointer hover:bg-zinc-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center font-black text-base shadow-xs">
                      U
                    </div>
                    <div>
                      <div className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                        <span>ups.com</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                          ENTERPRISE
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        Logistics & Retail • Verified Merchant Profile
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full mt-10">
          <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900">Verified Owner Badge</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Reply with official credibility and pin your top reviews.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1a73e8] flex items-center justify-center shrink-0">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900">Website Video Embed</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Embed 60s video reviews on your website in under 60 seconds.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900">Table QR Standees</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Generate printable QR standees for diners to record instantly.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
