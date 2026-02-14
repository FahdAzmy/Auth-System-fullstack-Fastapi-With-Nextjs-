'use client';


import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { forgotPassword, resetPassword } from '@/store/auth/auth-actions';
import { clearError, clearSuccess } from '@/store/auth/auth-slice';
import { useLanguage } from '@/lib/language-context';
import { validateEmail, validatePassword, validateVerificationCode, validatePasswordMatch, type ValidationErrors } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Mail, Lock, ArrowLeft } from 'lucide-react';

interface ForgotPasswordPageProps {
  onSuccess?: () => void;
  onBackClick?: () => void;
}

export function ForgotPasswordPage({ onSuccess, onBackClick }: ForgotPasswordPageProps) {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, successMessage } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Clear state on unmount
  useEffect(() => {
    dispatch(clearSuccess());
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  // Handle success navigation or step change
  useEffect(() => {
    if (successMessage) {
        if (step === 'email' && successMessage === 'PASSWORD_RESET_CODE_SENT') {
            setStep('reset');
            dispatch(clearSuccess()); // Clear so it doesn't trigger again immediately or confuse next step
        } else if (step === 'reset' && successMessage === 'PASSWORD_RESET_SUCCESS' && onSuccess) {
             const timer = setTimeout(() => {
               onSuccess();
             }, 1500);
             return () => clearTimeout(timer);
        }
    }
  }, [successMessage, step, onSuccess, dispatch]);

  const validateEmailStep = (): boolean => {
    const newErrors: ValidationErrors = {};
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetStep = (): boolean => {
    const newErrors: ValidationErrors = {};
    const codeError = validateVerificationCode(code);
    if (codeError) newErrors.code = codeError;
    const passwordError = validatePassword(newPassword);
    if (passwordError) newErrors.newPassword = passwordError;
    const matchError = validatePasswordMatch(newPassword, confirmPassword);
    if (matchError) newErrors.confirmPassword = matchError;
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailStep()) return;
    dispatch(forgotPassword(email));
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateResetStep()) return;
    dispatch(resetPassword({ email, code, new_password: newPassword }));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    if (field === 'email') setEmail(value);
    else if (field === 'newPassword') setNewPassword(value);
    else if (field === 'confirmPassword') setConfirmPassword(value);

    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
    if (error) dispatch(clearError());
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 overflow-hidden relative ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[40rem] h-[40rem] bg-accent/20 rounded-full blur-3xl opacity-40 animate-pulse mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-3xl opacity-40 animate-pulse delay-500 mix-blend-screen" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md glass-card rounded-3xl p-8 md:p-10 animate-fade-in-up">
        
        {/* Header with Icon */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/80 to-accent/80 shadow-lg shadow-primary/30 mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
            <Lock className="w-8 h-8 text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent mb-2">
            {step === 'email' ? t('forgotPasswordTitle') : t('resetPasswordTitle')}
          </h1>
          <p className="text-muted-foreground font-medium text-base">
            {step === 'email' ? t('forgotPasswordDescription') : t('resetPasswordDescription')}
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

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1.5 group">
              <label className="text-sm font-semibold text-foreground/80 ml-1 group-focus-within:text-primary transition-colors">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => handleInputChange(e, 'email')}
                  disabled={isLoading}
                  className={`pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 ${
                    validationErrors.email ? 'border-destructive focus:ring-destructive/20' : ''
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs font-semibold text-destructive ml-1 animate-slide-in-right">
                  {t(validationErrors.email)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-accent hover:to-primary text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t('loading')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('forgotPasswordButton')}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={onBackClick}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl border-2 border-transparent hover:border-border/50 hover:bg-white/5 text-muted-foreground hover:text-foreground font-semibold transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('backToLogin')}
                </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-6">
            {/* Verification Code Field */}
            <div className="space-y-1.5 group">
              <label className="text-sm font-semibold text-foreground/80 ml-1 group-focus-within:text-primary transition-colors">
                  {t('verificationCode')}
              </label>
              <Input
                type="text"
                placeholder={t('verificationCodePlaceholder')}
                value={code}
                onChange={handleCodeChange}
                disabled={isLoading}
                maxLength={6}
                className={`h-14 text-2xl font-bold text-center tracking-widest rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 ${
                  validationErrors.code ? 'border-destructive focus:ring-destructive/20' : ''
                }`}
              />
              {validationErrors.code && (
                <p className="text-xs font-semibold text-destructive ml-1 animate-slide-in-right">
                  {t(validationErrors.code)}
                </p>
              )}
            </div>

            {/* New Password Field */}
            <div className="space-y-1.5 group">
              <label className="text-sm font-semibold text-foreground/80 ml-1 group-focus-within:text-primary transition-colors">
                {t('newPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  placeholder={t('newPasswordPlaceholder')}
                  value={newPassword}
                  onChange={(e) => handleInputChange(e, 'newPassword')}
                  disabled={isLoading}
                  className={`pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 ${
                    validationErrors.newPassword ? 'border-destructive focus:ring-destructive/20' : ''
                  }`}
                />
              </div>
              {validationErrors.newPassword && (
                <p className="text-xs font-semibold text-destructive ml-1 animate-slide-in-right">
                  {t(validationErrors.newPassword)}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5 group">
                <label className="text-sm font-semibold text-foreground/80 ml-1 group-focus-within:text-primary transition-colors">
                  {t('confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder={t('confirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => handleInputChange(e, 'confirmPassword')}
                    disabled={isLoading}
                    className={`pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 ${
                      validationErrors.confirmPassword ? 'border-destructive focus:ring-destructive/20' : ''
                    }`}
                  />
                </div>
                {validationErrors.confirmPassword && (
                    <p className="text-xs font-semibold text-destructive ml-1 animate-slide-in-right">
                    {t(validationErrors.confirmPassword)}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-accent hover:to-primary text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t('loading')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('resetPasswordButton')}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                 {/* Back Button */}
                 <button
                  type="button"
                  onClick={onBackClick}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl border-2 border-transparent hover:border-border/50 hover:bg-white/5 text-muted-foreground hover:text-foreground font-semibold transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('backToLogin')}
                </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
