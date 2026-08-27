import React from 'react';
import { Shield, Zap, Star, Check, X, Building2 } from 'lucide-react';

interface CopoBusinessPricingModalProps {
  onClose: () => void;
  onSelectPlan: (plan: 'basic' | 'pro' | 'premium') => void;
  currentPlan?: 'none' | 'basic' | 'pro' | 'premium' | 'free';
}

export const CopoBusinessPricingModal: React.FC<CopoBusinessPricingModalProps> = ({ 
  onClose, 
  onSelectPlan,
  currentPlan = 'none'
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-8 pb-6 text-center relative border-b border-zinc-100">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-3xl font-black text-zinc-900 mb-3 tracking-tight">Upgrade Your Business</h2>
          <p className="text-zinc-500 max-w-xl mx-auto font-medium">Turn video reviews into your most powerful marketing asset. Choose the plan that fits your goals.</p>
        </div>

        <div className="p-8 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Basic Plan */}
          <div className={`rounded-2xl border-2 p-6 flex flex-col h-full ${currentPlan === 'basic' ? 'border-zinc-300 bg-zinc-50/50' : 'border-zinc-200 bg-white'}`}>
            <div className="mb-4">
              <Shield className="w-8 h-8 text-zinc-400 mb-3" />
              <h3 className="text-xl font-bold text-zinc-900">Basic</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-900">$0</span>
                <span className="text-zinc-500 font-medium">/ month</span>
              </div>
              <p className="text-sm text-zinc-500 font-medium mt-1">Free forever.</p>
              <p className="text-sm text-zinc-500 mt-4 font-medium">Get listed and stay informed.</p>
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Claim business
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Verified Badge
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Update address/hours
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Email alerts for new videos
              </li>
            </ul>

            <button 
              disabled={currentPlan === 'basic'}
              onClick={() => onSelectPlan('basic')}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${currentPlan === 'basic' ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'}`}
            >
              {currentPlan === 'none' ? 'Claim Business (Free)' : currentPlan === 'basic' ? 'Current Plan' : 'Downgrade to Basic'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`rounded-2xl border-2 p-6 flex flex-col h-full relative shadow-lg ${currentPlan === 'pro' ? 'border-[#1a73e8]' : 'border-[#1a73e8] bg-white '}`}>
            {currentPlan !== 'pro' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a73e8] text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-4">
              <Zap className="w-8 h-8 text-[#1a73e8] mb-3" />
              <h3 className="text-xl font-bold text-zinc-900">Pro</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-900">$149</span>
                <span className="text-zinc-500 font-medium">/ month</span>
              </div>
              <p className="text-sm text-zinc-500 font-medium mt-1">Cancel anytime.</p>
              <p className="text-sm text-zinc-500 mt-4 font-medium">Engage customers and drive sales.</p>
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-[#1a73e8] shrink-0" /> Everything in Basic
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-[#1a73e8] shrink-0" /> Add Website Link
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-[#1a73e8] shrink-0" /> Add "Book Now" / CTA Button
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-[#1a73e8] shrink-0" /> Publicly Reply to videos
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-[#1a73e8] shrink-0" /> Up to 5 Direct Messages / day
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-[#1a73e8] shrink-0" /> Dedicated Business Dashboard
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-[#1a73e8] shrink-0" /> Custom Review Invite Links & QR Codes
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-[#1a73e8] shrink-0" /> Custom QR Print Kit (Stickers + Table Tents)
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-[#1a73e8] shrink-0" /> Download Videos for Social Media
              </li>
            </ul>

            <button 
              disabled={currentPlan === 'pro'}
              onClick={() => onSelectPlan('pro')}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${currentPlan === 'pro' ? 'bg-[#e8f0fe] text-[#1a73e8] cursor-not-allowed border border-[#d2e3fc]' : 'bg-[#1a73e8] text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'}`}
            >
              {currentPlan === 'none' ? 'Claim & Upgrade to Pro' : currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className={`rounded-2xl border-2 p-6 flex flex-col h-full bg-gradient-to-b from-amber-50/30 to-white ${currentPlan === 'premium' ? 'border-amber-400' : 'border-zinc-200'}`}>
            <div className="mb-4">
              <Star className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="text-xl font-bold text-zinc-900">Premium</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-900">$299</span>
                <span className="text-zinc-500 font-medium">/ month</span>
              </div>
              <p className="text-sm text-zinc-500 font-medium mt-1">Cancel anytime.</p>
              <p className="text-sm text-zinc-500 mt-4 font-medium">The ultimate marketing engine.</p>
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> Everything in Pro
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> Up to 10 Direct Messages / day
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> Website Video Widget (Embed videos)
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> Full Commercial Rights (Paid Ads)
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> Advanced Analytics & Tracking
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> Premium NFC Tap Stands & Decals
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> SEO Rich Snippets (Google Search)
              </li>
              <li className="flex gap-3 text-sm text-zinc-700 font-medium">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> CRM Integrations (Shopify, Salesforce)
              </li>
            </ul>

            <button 
              disabled={currentPlan === 'premium'}
              onClick={() => onSelectPlan('premium')}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${currentPlan === 'premium' ? 'bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-200' : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-md'}`}
            >
              {currentPlan === 'none' ? 'Claim & Upgrade to Premium' : currentPlan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
