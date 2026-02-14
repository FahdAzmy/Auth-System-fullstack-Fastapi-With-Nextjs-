'use client';

import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { verifyEmail, resendCode } from '@/store/auth/auth-actions';
import { clearError, clearSuccess, clearPendingEmail } from '@/store/auth/auth-slice';
import { useLanguage } from '@/lib/language-context';
import { validateVerificationCode, type ValidationErrors } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Mail } from 'lucide-react';

interface VerifyEmailPageProps {
  onSuccess?: () => void;
  onBackClick?: () => void;
}

export function VerifyEmailPage({ onSuccess, onBackClick }: VerifyEmailPageProps) {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, successMessage, pendingEmail } = useSelector((state: RootState) => state.auth);
  
  const [code, setCode] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [canResend, setCanResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Clear state on unmount
  useEffect(() => {
    dispatch(clearSuccess());
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  // Handle success navigation
  useEffect(() => {
    if (successMessage === 'EMAIL_VERIFIED' && onSuccess) {
       // Only navigate if email was truly verified, not just code resent
       const timer = setTimeout(() => {
         dispatch(clearPendingEmail());
         onSuccess();
       }, 1500);
       return () => clearTimeout(timer);
    }
  }, [successMessage, onSuccess, dispatch]);

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const codeError = validateVerificationCode(code);
    if (codeError) newErrors.code = codeError;
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (!pendingEmail) {
      dispatch(clearError());
      return;
    }
    
    dispatch(verifyEmail({ email: pendingEmail, code }));
  };

  const handleResendCode = async () => {
    if (!pendingEmail) return;
    dispatch(resendCode(pendingEmail));
    setTimeLeft(60);
    setCanResend(false);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    if (validationErrors.code) {
      const newErrors = { ...validationErrors };
      delete newErrors.code;
      setValidationErrors(newErrors);
    }
    if (error) dispatch(clearError());
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 overflow-hidden relative ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[20%] left-[20%] w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-3xl opacity-40 animate-pulse mix-blend-screen" />
      <div className="absolute bottom-[20%] right-[20%] w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-3xl opacity-40 animate-pulse delay-700 mix-blend-screen" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md glass-card rounded-3xl p-8 md:p-10 animate-fade-in-up">
        
        {/* Header with Icon */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/80 to-accent/80 shadow-lg shadow-primary/30 mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
            <Mail className="w-8 h-8 text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent mb-2">
            {t('verifyEmailTitle')}
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            {t('verifyEmailDescription')}
          </p>
        </div>

        {/* Success/Error Message */}
        {(error || successMessage) && (
          <div
            className={`mb-6 p-4 rounded-xl border font-semibold backdrop-blur-md flex items-center gap-3 animate-shake ${
              successMessage
                ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${successMessage ? 'bg-green-500' : 'bg-destructive'}`} />
            {t((successMessage || error)!)}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <div className="relative group">
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                disabled={isLoading}
                maxLength={6}
                className={`h-16 text-center text-3xl tracking-[1em] font-mono rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 shadow-inner hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 ${
                  validationErrors.code ? 'border-destructive focus:ring-destructive/20' : ''
                }`}
              />
              {/* Optional: Add decorative dashes between numbers if we wanted a more complex component, but simple is good for now */}
            </div>
            {validationErrors.code && (
              <p className="text-sm font-bold text-destructive text-center animate-slide-in-right">
                {t(validationErrors.code)}
              </p>
            )}
          </div>

          <div className="text-center">
             <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend || isLoading}
                className={`text-sm font-bold transition-colors ${
                    canResend 
                    ? 'text-primary hover:text-accent hover:underline underline-offset-4 cursor-pointer' 
                    : 'text-muted-foreground cursor-not-allowed'
                }`}
              >
                {t('resendCode')}
                {!canResend && <span className="ml-1 opacity-70">({timeLeft}s)</span>}
              </button>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-accent hover:to-primary text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('loading')}</span>
                </>
              ) : (
                <span>{t('verifyButton')}</span>
              )}
            </button>

            <button
              type="button"
              onClick={onBackClick}
              disabled={isLoading}
              className="w-full h-12 rounded-xl border-2 border-transparent hover:border-border/50 hover:bg-white/5 text-muted-foreground hover:text-foreground font-semibold transition-all duration-300 active:scale-[0.98]"
            >
              {t('backToLogin')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
