'use client';

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
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
        if (step === 'email' && successMessage.includes('sent')) {
            setStep('reset');
            dispatch(clearSuccess()); // Clear so it doesn't trigger again immediately or confuse next step
        } else if (step === 'reset' && !successMessage.includes('sent') && onSuccess) {
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
    <div className={`min-h-screen flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Icon Header */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-2xl opacity-75 animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
              <Lock className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-tighter mb-3">
            {step === 'email' ? t('forgotPasswordTitle') : t('resetPasswordTitle')}
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            {step === 'email' ? t('forgotPasswordDescription') : t('resetPasswordDescription')}
          </p>
        </div>

        {/* Success/Error Message */}
        {(error || successMessage) && (
          <div
            className={`mb-6 p-4 rounded-2xl font-semibold backdrop-blur-sm border-2 transition-all duration-300 ${
              successMessage
                ? 'bg-green-50/80 dark:bg-green-950/30 text-green-900 dark:text-green-200 border-green-300 dark:border-green-700'
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}
          >
            {successMessage || error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Mail className="w-5 h-5 text-primary" />
                <label className="text-sm font-bold uppercase tracking-wider">{t('email')}</label>
              </div>
              <Input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => handleInputChange(e, 'email')}
                disabled={isLoading}
                className={`h-14 text-base rounded-2xl px-5 border-2 font-medium transition-all duration-200 ${
                  validationErrors.email
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border hover:border-primary focus:border-primary'
                }`}
              />
              {validationErrors.email && (
                <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  {t(validationErrors.email)}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-black rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                <>
                  {t('forgotPasswordButton')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={onBackClick}
              disabled={isLoading}
              className="w-full h-12 text-base font-bold rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('backToLogin')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            {/* Verification Code Field */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider block px-1">{t('verificationCode')}</label>
              <Input
                type="text"
                placeholder={t('verificationCodePlaceholder')}
                value={code}
                onChange={handleCodeChange}
                disabled={isLoading}
                maxLength={6}
                className={`h-14 text-3xl font-black text-center tracking-widest rounded-2xl border-2 transition-all duration-200 ${
                  validationErrors.code
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border hover:border-primary focus:border-primary'
                }`}
              />
              {validationErrors.code && (
                <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  {t(validationErrors.code)}
                </p>
              )}
            </div>

            {/* New Password Field */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Lock className="w-5 h-5 text-primary" />
                <label className="text-sm font-bold uppercase tracking-wider">{t('newPassword')}</label>
              </div>
              <Input
                type="password"
                placeholder={t('newPasswordPlaceholder')}
                value={newPassword}
                onChange={(e) => handleInputChange(e, 'newPassword')}
                disabled={isLoading}
                className={`h-14 text-base rounded-2xl px-5 border-2 font-medium transition-all duration-200 ${
                  validationErrors.newPassword
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border hover:border-primary focus:border-primary'
                }`}
              />
              {validationErrors.newPassword && (
                <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  {t(validationErrors.newPassword)}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Lock className="w-5 h-5 text-primary" />
                <label className="text-sm font-bold uppercase tracking-wider">{t('confirmPassword')}</label>
              </div>
              <Input
                type="password"
                placeholder={t('confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => handleInputChange(e, 'confirmPassword')}
                disabled={isLoading}
                className={`h-14 text-base rounded-2xl px-5 border-2 font-medium transition-all duration-200 ${
                  validationErrors.confirmPassword
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border hover:border-primary focus:border-primary'
                }`}
              />
              {validationErrors.confirmPassword && (
                <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  {t(validationErrors.confirmPassword)}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-2 text-lg font-black rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                <>
                  {t('resetPasswordButton')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={onBackClick}
              disabled={isLoading}
              className="w-full h-12 text-base font-bold rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('backToLogin')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
