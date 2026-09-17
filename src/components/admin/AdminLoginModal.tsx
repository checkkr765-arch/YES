import React, { useState } from 'react';
import { Lock, Shield, KeyRound, ArrowRight, Loader2, AlertCircle, CheckCircle2, QrCode } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [isSetupNeeded, setIsSetupNeeded] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Step 1: Validate Username & Password
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login-step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setTempToken(data.tempToken);
      setIsSetupNeeded(data.isSetupNeeded || false);
      if (data.qrCode) setQrCodeUrl(data.qrCode);
      if (data.manualKey) setManualKey(data.manualKey);
      if (data.recoveryCodes) setRecoveryCodes(data.recoveryCodes);

      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate TOTP or Recovery Code
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login-step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code: totpCode.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid TOTP code');
      }

      onLoginSuccess(data.token);
    } catch (err: any) {
      setError(err.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#1E1410] border border-[#C5A46D]/40 rounded-3xl p-8 shadow-2xl text-[#F7F3ED]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#3A2418] border border-[#C5A46D]/40 flex items-center justify-center mx-auto mb-4 text-[#C5A46D] shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A46D]">
            ALABBAS SECURITY GATEWAY
          </span>
          <h2 className="font-serif-luxury text-2xl font-bold mt-1 text-[#F7F3ED]">
            Private Administration
          </h2>
          <p className="text-xs text-[#E8D8C2]/70 mt-1">
            {step === 1 ? 'Step 1 of 2: Primary Credentials' : 'Step 2 of 2: Google Authenticator 2FA'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: USERNAME & PASSWORD */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-sm text-[#F7F3ED] focus:border-[#C5A46D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-sm text-[#F7F3ED] focus:border-[#C5A46D] focus:outline-none"
              />
              <p className="text-[11px] text-[#E8D8C2]/50 mt-1.5">
                Default initial credentials: <code className="text-[#C5A46D]">admin</code> / <code className="text-[#C5A46D]">Alabbas@2026!</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#C5A46D] hover:bg-[#b8955a] text-[#1E1410] font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>CONTINUE TO 2FA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: TOTP CODE / QR SETUP */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-5">
            {isSetupNeeded && qrCodeUrl && (
              <div className="bg-[#281A13] p-4 rounded-2xl border border-[#C5A46D]/30 text-center space-y-3">
                <p className="text-xs font-bold text-[#C5A46D] uppercase tracking-wider">
                  Scan With Google Authenticator
                </p>
                <div className="bg-white p-2 rounded-xl inline-block shadow-md">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                </div>
                <p className="text-[11px] text-[#E8D8C2]/70 font-mono break-all">
                  Manual key: <span className="text-[#C5A46D] select-all">{manualKey}</span>
                </p>
                {recoveryCodes.length > 0 && (
                  <div className="text-left bg-[#1E1410] p-2.5 rounded-lg text-[10px] text-[#E8D8C2]/70">
                    <p className="text-[#C5A46D] font-bold mb-1">Your Backup Recovery Codes:</p>
                    <div className="grid grid-cols-2 gap-1 font-mono">
                      {recoveryCodes.slice(0, 4).map((c, i) => (
                        <span key={i}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                6-Digit TOTP Code or Recovery Code
              </label>
              <input
                type="text"
                autoFocus
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="123456 or ABCDEF12"
                className="w-full px-4 py-3 rounded-xl bg-[#281A13] border border-[#C5A46D]/20 text-center font-mono text-lg tracking-widest text-[#F7F3ED] focus:border-[#C5A46D] focus:outline-none"
              />
              <p className="text-[11px] text-[#E8D8C2]/60 mt-1 text-center">
                Enter the code displayed in your Google Authenticator app
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-xs uppercase tracking-wider text-[#E8D8C2]/70 hover:bg-white/5 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C5A46D] hover:bg-[#b8955a] text-[#1E1410] font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>VERIFY &amp; ENTER</span>}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-4 border-t border-white/5 text-center">
          <button
            onClick={onClose}
            className="text-xs text-[#E8D8C2]/40 hover:text-[#E8D8C2]/80 transition-colors cursor-pointer"
          >
            Cancel and return to showroom
          </button>
        </div>
      </div>
    </div>
  );
};
