import React, { useState } from 'react';
import { X, Lock, CreditCard, Loader2, CheckCircle2, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';

interface CopoCreemCheckoutModalProps {
  plan: 'pro' | 'premium';
  onClose: () => void;
  onSuccess: (details?: { email?: string; last4?: string; paymentMethod?: string }) => void;
}

export const CopoCreemCheckoutModal: React.FC<CopoCreemCheckoutModalProps> = ({ plan, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const price = plan === 'pro' ? '$149.00' : '$299.00';
  const planName = plan === 'pro' ? 'Pro Plan' : 'Premium Plan';

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length > 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    return clean;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate Creem payment gateway processing & webhook confirmation
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const cleanDigits = cardNumber.replace(/\D/g, '');
      const last4 = cleanDigits.length >= 4 ? cleanDigits.slice(-4) : '4242';
      setTimeout(() => {
        onSuccess({
          email: email.trim() || 'business@owner.com',
          last4,
          paymentMethod: 'Credit Card'
        });
      }, 1200);
    }, 1200);
  };

  const handleExpressPay = (method: 'apple_pay' | 'google_pay') => {
    setPaymentMethod(method);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess({
          email: email.trim() || 'apple_pay_user@icloud.com',
          last4: method === 'apple_pay' ? 'Apple Pay' : 'Google Pay',
          paymentMethod: method === 'apple_pay' ? 'Apple Pay' : 'Google Pay'
        });
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden border border-zinc-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Creem Header */}
        <div className="bg-gradient-to-b from-zinc-50 to-white border-b border-zinc-100 p-6 text-center relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-zinc-200/80 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold mb-3 shadow-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>creem<span className="text-emerald-600">.io</span> secure checkout</span>
          </div>

          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
            {price} <span className="text-sm font-medium text-zinc-500">/ month</span>
          </h2>
          <p className="text-sm text-zinc-600 font-semibold mt-1">
            Yoouz {planName} • <span className="text-emerald-600 font-bold">Cancel anytime</span>
          </p>
        </div>

        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50 animate-in zoom-in">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-2">Payment Confirmed</h3>
            <p className="text-sm text-zinc-600 font-medium max-w-xs">
              Your {planName} subscription is now active. Receipt and recurring invoice have been sent to your email.
            </p>
            <div className="mt-6 px-4 py-2 bg-zinc-100 text-zinc-600 rounded-xl text-xs font-bold flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading your Pro dashboard...
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Express Checkout Options */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block text-center">Express Checkout</span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleExpressPay('apple_pay')}
                  className="py-3 px-4 bg-black hover:bg-zinc-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  <span className="text-base font-semibold">Pay</span>
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleExpressPay('google_pay')}
                  className="py-3 px-4 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  <span className="font-extrabold text-[#4285F4]">G</span>
                  <span className="font-semibold text-zinc-800">Pay</span>
                </button>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="flex-shrink mx-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Or pay with card</span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Business Billing Email
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@yourcompany.com (optional in demo)"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-zinc-900 transition-all text-sm"
                />
              </div>

              {/* Card Information */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Card Information
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                    <span>VISA</span>
                    <span>MC</span>
                    <span>AMEX</span>
                    <span>DISC</span>
                  </div>
                </div>

                <div className="border border-zinc-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-zinc-50 focus-within:bg-white">
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input 
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full pl-11 pr-4 py-3 bg-transparent border-b border-zinc-200 focus:outline-none font-mono text-sm font-medium text-zinc-900"
                    />
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-zinc-200">
                    <input 
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      placeholder="MM / YY"
                      className="px-3.5 py-3 bg-transparent focus:outline-none font-mono text-sm font-medium text-zinc-900 text-center"
                    />
                    <input 
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      placeholder="CVC"
                      className="px-3.5 py-3 bg-transparent focus:outline-none font-mono text-sm font-medium text-zinc-900 text-center"
                    />
                    <input 
                      type="text"
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value.slice(0, 10))}
                      placeholder="ZIP / Postal"
                      className="px-3 py-3 bg-transparent focus:outline-none text-sm font-medium text-zinc-900 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Renewal Notice */}
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3.5 text-xs text-zinc-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>30-Day Money Back & Auto-Renewal</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  You will be billed {price} monthly starting today. You can pause, change plans, or cancel anytime directly from your Business Dashboard.
                </p>
              </div>

              {/* Pay Button */}
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-xl font-bold text-sm bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Subscribe for {price} / month
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium pt-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>256-bit encrypted via Creem.io merchant gateway</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

