'use client';

import React from "react"

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { validateEmail, validatePassword, type ValidationErrors } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Mail, Lock } from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export function LoginPage({
  onSuccess,
  onSignUpClick,
  onForgotPasswordClick,
}: LoginPageProps) {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: t('loginSuccess') });
      setFormData({ email: '', password: '' });
      setErrors({});
      if (onSuccess) setTimeout(onSuccess, 500);
    } catch (err) {
      setMessage({ type: 'error', text: t('loginError') });
    } finally {
      setIsLoading(false);
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
          <h1 className="text-5xl font-black tracking-tighter mb-3">{t('loginTitle')}</h1>
          <p className="text-lg text-muted-foreground font-medium">{t('loginDescription')}</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Mail className="w-5 h-5 text-primary" />
              <label className="text-sm font-bold uppercase tracking-wider">{t('email')}</label>
            </div>
            <div className="relative">
              <Input
                name="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`h-14 text-base rounded-2xl px-5 border-2 font-medium transition-all duration-200 ${
                  errors.email
                    ? 'border-destructive bg-destructive/5 focus:ring-destructive/20'
                    : 'border-border hover:border-primary focus:border-primary'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                {t(errors.email)}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Lock className="w-5 h-5 text-primary" />
              <label className="text-sm font-bold uppercase tracking-wider">{t('password')}</label>
            </div>
            <Input
              name="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`h-14 text-base rounded-2xl px-5 border-2 font-medium transition-all duration-200 ${
                errors.password
                  ? 'border-destructive bg-destructive/5 focus:ring-destructive/20'
                  : 'border-border hover:border-primary focus:border-primary'
              }`}
            />
            {errors.password && (
              <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                {t(errors.password)}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              {t('forgotPassword')}
            </button>
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
                <span>{t('loading')}</span>
              </>
            ) : (
              <>
                <span>{t('logIn')}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground font-medium">
            {t('noAccount')}{' '}
            <button
              onClick={onSignUpClick}
              className="font-black text-primary hover:text-primary/80 transition-colors"
            >
              {t('signUp')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
