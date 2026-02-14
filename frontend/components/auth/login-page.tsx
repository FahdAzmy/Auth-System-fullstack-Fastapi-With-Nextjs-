'use client';

import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { login } from '@/store/auth/auth-actions';
import { clearError } from '@/store/auth/auth-slice';
import { useLanguage } from '@/lib/language-context';
import { validateEmail, validateLoginPassword, type ValidationErrors } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Mail, Lock } from 'lucide-react';

interface LoginPageProps {
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export function LoginPage({
  onSignUpClick,
  onForgotPasswordClick,
}: LoginPageProps) {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
    if (error) dispatch(clearError());
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateLoginPassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(login(formData));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 overflow-hidden relative ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-accent/20 rounded-full blur-3xl opacity-50 animate-pulse delay-700 mix-blend-screen" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-lg glass-card rounded-3xl p-8 md:p-12 animate-fade-in-up">
        
        {/* Header with Icon */}
        <div className="mb-10 text-center relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/80 to-accent/80 shadow-lg shadow-primary/30 mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
            <Lock className="w-10 h-10 text-white drop-shadow-md" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent mb-2">
            {t('loginTitle')}
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            {t('loginDescription')}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive font-semibold flex items-center gap-3 animate-shake">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            {t(error!)}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Field */}
          <div className="space-y-2 group">
            <label className="text-sm font-semibold text-foreground/80 ml-1 group-focus-within:text-primary transition-colors">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                name="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`pl-12 h-14 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 ${
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

          {/* Password Field */}
          <div className="space-y-2 group">
             <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-foreground/80 group-focus-within:text-primary transition-colors">
                  {t('password')}
                </label>
                <button
                  type="button"
                  onClick={onForgotPasswordClick}
                  className="text-xs font-bold text-primary hover:text-accent transition-colors underline-offset-4 hover:underline"
                >
                  {t('forgotPassword')}
                </button>
             </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                name="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`pl-12 h-14 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 ${
                  validationErrors.password ? 'border-destructive focus:ring-destructive/20' : ''
                }`}
              />
            </div>
            {validationErrors.password && (
              <p className="text-xs font-semibold text-destructive ml-1 animate-slide-in-right">
                {t(validationErrors.password)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 mt-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:to-primary text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('loading')}</span>
              </>
            ) : (
              <>
                <span>{t('loginButton')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground font-medium">
            {t('noAccount')}{' '}
            <button
              onClick={onSignUpClick}
              className="font-bold text-primary hover:text-accent transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {t('signUpLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
