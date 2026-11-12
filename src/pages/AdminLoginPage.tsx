import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Mail, Shield } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export const AdminLoginPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has the special access flag
    // If they do, redirect to dashboard (already logged in)
    const adminAccess = sessionStorage.getItem('admin_access_granted');
    const token = sessionStorage.getItem('admin_token');
    const expiry = sessionStorage.getItem('admin_expiry');

    if (adminAccess === 'true' && token && expiry) {
      const expiryTime = parseInt(expiry);
      if (Date.now() < expiryTime) {
        // Session is still valid, redirect to dashboard
        window.location.href = '/admin/dashboard';
      } else {
        // Session expired, clear storage
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_expiry');
        sessionStorage.removeItem('admin_access_granted');
      }
    }
  }, [navigate]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/admin/auth?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Password verified, send OTP
        setOtpSending(true);
        const otpResponse = await fetch(`${API_URL}/admin/auth?action=send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const otpData = await otpResponse.json();
        setOtpSending(false);

        if (otpResponse.ok) {
          setStep('otp');
          setMaskedEmail(otpData.email);
          setError("");
        } else {
          setError(otpData.error || 'Failed to send OTP');
        }
      } else {
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/admin/auth?action=verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token and mark as logged in
        const expiry = Date.now() + (data.expiresIn * 1000);
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('admin_expiry', expiry.toString());
        sessionStorage.setItem('admin_access_granted', 'true');

        // Force auth context update by reloading
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpSending(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/admin/auth?action=send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        // Show success message temporarily
        setError("OTP resent successfully!");
        setTimeout(() => setError(""), 3000);
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-theme-bg text-theme-text">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md"
      >
        <div className="surface-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-theme-accent-soft border border-theme-border-strong rounded-full mb-4">
              {step === 'password' ? (
                <Lock size={24} className="text-theme-accent" />
              ) : (
                <Shield size={24} className="text-theme-accent" />
              )}
            </div>
            <h1 className="heading-2 mb-2">
              {step === 'password' ? 'THE SYSTEM CORE' : 'Verify OTP'}
            </h1>
            <p className="text-theme-muted text-xs whitespace-pre-line">
              {step === 'password'
                ? 'A protected environment where configuration, content, and control converge. Access is limited to verified identities.'
                : `OTP sent to ${maskedEmail}`
              }
            </p>
          </div>

          {/* Login Form */}
          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg p-3 text-rose-700 dark:text-rose-300 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-theme-muted mb-2">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full px-4 py-2.5 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg focus:border-theme-accent transition-colors text-theme-text placeholder:text-theme-muted pr-12"
                    placeholder="Enter secret key"
                    required
                    disabled={loading || otpSending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-accent transition-colors"
                    disabled={loading || otpSending}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || otpSending}
              >
                {otpSending ? 'Sending OTP...' : loading ? 'Verifying...' : 'Continue'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`${error.includes('success') ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'} border rounded-lg p-3 text-sm text-center`}
                >
                  {error}
                </motion.div>
              )}

              {/* OTP Field */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-theme-muted mb-2">
                  Enter 6-Digit OTP
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      if (value.length <= 6) {
                        setOtp(value);
                        setError("");
                      }
                    }}
                    className="w-full px-4 py-2.5 pl-12 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg focus:border-theme-accent transition-colors text-theme-text placeholder:text-theme-muted tracking-widest font-mono text-center text-lg"
                    placeholder="XXXXXX"
                    required
                    disabled={loading}
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-theme-muted mt-2 text-center">
                  Check your email for the OTP code
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={otpSending}
                  className="text-sm text-theme-accent hover:text-theme-accent-hover transition-colors disabled:opacity-50"
                >
                  {otpSending ? 'Sending...' : 'Resend OTP'}
                </button>
                <span className="text-theme-muted text-sm mx-2">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('password');
                    setOtp('');
                    setError('');
                  }}
                  className="text-sm text-theme-muted hover:text-theme-text transition-colors"
                >
                  Back to Password
                </button>
              </div>
            </form>
          )}

          {/* Footer Note */}
          <p className="text-theme-muted text-xs text-center mt-6">
            Unauthorized access is prohibited and will be logged.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
