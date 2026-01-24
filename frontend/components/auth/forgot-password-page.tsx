'use client';

import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"

import { CardContent } from "@/components/ui/card"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import React from "react"

import { useState } from 'react';
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
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validateEmailStep = (): boolean => {
    const newErrors: ValidationErrors = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    setErrors(newErrors);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailStep()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessage({ type: 'success', text: 'Check your email for the reset code' });
      setStep('reset');
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: t('emailError') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateResetStep()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessage({ type: 'success', text: t('passwordResetSuccess') });
      setEmail('');
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});

      if (onSuccess) {
        setTimeout(onSuccess, 500);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: t('emailError') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    if (errors.code) {
      const newErrors = { ...errors };
      delete newErrors.code;
      setErrors(newErrors);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    if (field === 'email') setEmail(value);
    else if (field === 'newPassword') setNewPassword(value);
    else if (field === 'confirmPassword') setConfirmPassword(value);

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
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
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl font-semibold backdrop-blur-sm border-2 transition-all duration-300 ${
              message.type === 'success'
                ? 'bg-green-50/80 dark:bg-green-950/30 text-green-900 dark:text-green-200 border-green-300 dark:border-green-700'
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}
          >
            {message.text}
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
                  errors.email
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border hover:border-primary focus:border-primary'
                }`}
              />
              {errors.email && (
                <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  {t(errors.email)}
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
                  errors.code
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border hover:border-primary focus:border-primary'
                }`}
              />
              {errors.code && (
                <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  {t(errors.code)}
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
                  errors.newPassword
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border hover:border-primary focus:border-primary'
                }`}
              />
              {errors.newPassword && (
                <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  {t(errors.newPassword)}
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
                  errors.confirmPassword
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border hover:border-primary focus:border-primary'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  {t(errors.confirmPassword)}
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
