'use client';

import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { signup } from '@/store/auth/auth-actions';
import { clearError, setPendingEmail } from '@/store/auth/auth-slice';
import { useLanguage } from '@/lib/language-context';
import { validateEmail, validatePassword, validateFullName, validatePasswordMatch, type ValidationErrors } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator';

interface SignUpPageProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export function SignUpPage({ onSuccess, onLoginClick }: SignUpPageProps) {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, successMessage } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle success message -> transition
  useEffect(() => {
    if (successMessage && onSuccess) {
      const timer = setTimeout(() => {
        onSuccess();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, onSuccess]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const nameError = validateFullName(formData.fullName);
    if (nameError) newErrors.fullName = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const matchError = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (matchError) newErrors.confirmPassword = matchError;

    if (!agreeToTerms) newErrors.terms = 'requiredField';

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(setPendingEmail(formData.email));

    dispatch(signup({
      name: formData.fullName,
      email: formData.email,
      password: formData.password
    }));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 overflow-hidden relative ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[45rem] h-[45rem] bg-secondary/20 rounded-full blur-3xl opacity-40 animate-pulse mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45rem] h-[45rem] bg-primary/20 rounded-full blur-3xl opacity-40 animate-pulse delay-1000 mix-blend-screen" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-lg glass-card rounded-3xl p-8 md:p-10 animate-fade-in-up my-4">
        
        {/* Header with Icon */}
        <div className="mb-8 text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/80 to-secondary/80 shadow-lg shadow-primary/30 mb-4 rotate-3 hover:rotate-6 transition-transform duration-300">
            <User className="w-8 h-8 text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary mb-2">
            {t('signUpTitle')}
          </h1>
          <p className="text-muted-foreground font-medium text-base">
            {t('signUpDescription')}
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
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name Field */}
          <div className="space-y-1.5 group">
            <label className="text-sm font-semibold text-foreground/80 ml-1 group-focus-within:text-primary transition-colors">
              {t('fullName')}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                name="fullName"
                type="text"
                placeholder={t('fullNamePlaceholder')}
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
                className={`pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 ${
                  validationErrors.fullName ? 'border-destructive focus:ring-destructive/20' : ''
                }`}
              />
            </div>
            {validationErrors.fullName && (
              <p className="text-xs font-semibold text-destructive ml-1 animate-slide-in-right">
                {t(validationErrors.fullName)}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5 group">
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

          {/* Password Field */}
          <div className="space-y-1.5 group">
            <label className="text-sm font-semibold text-foreground/80 ml-1 group-focus-within:text-primary transition-colors">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                name="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-primary/20 ${
                  validationErrors.password ? 'border-destructive focus:ring-destructive/20' : ''
                }`}
              />
            </div>
            {formData.password && !validationErrors.password && (
              <div className="mt-2">
                 <PasswordStrengthIndicator password={formData.password} />
              </div>
            )}
            {validationErrors.password && (
              <p className="text-xs font-semibold text-destructive ml-1 animate-slide-in-right">
                {t(validationErrors.password)}
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
                name="confirmPassword"
                type="password"
                placeholder={t('confirmPasswordPlaceholder')}
                value={formData.confirmPassword}
                onChange={handleChange}
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

          {/* Terms Checkbox */}
          <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${validationErrors.terms ? 'bg-destructive/5 border border-destructive/20' : 'bg-muted/30 border border-transparent'}`}>
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => {
                setAgreeToTerms(checked as boolean);
                if (validationErrors.terms) {
                  const newErrors = { ...validationErrors };
                  delete newErrors.terms;
                  setValidationErrors(newErrors);
                }
              }}
              disabled={isLoading}
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="terms" className="text-sm font-medium leading-relaxed cursor-pointer text-muted-foreground select-none">
              {t('agreeTerms')} <span className="text-primary font-bold hover:underline underline-offset-4">{t('termsLink')}</span>
            </label>
          </div>
          {validationErrors.terms && (
            <p className="text-xs font-semibold text-destructive ml-1 animate-slide-in-right">
              {t(validationErrors.terms)}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 mt-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:to-primary text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('loading')}</span>
              </>
            ) : (
              <>
                <span>{t('signUpButton')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground font-medium">
            {t('haveAccount')}{' '}
            <button
              onClick={onLoginClick}
              className="font-bold text-primary hover:text-secondary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {t('loginLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
