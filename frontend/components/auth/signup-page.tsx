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
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-tighter mb-3">{t('signUpTitle')}</h1>
          <p className="text-lg text-muted-foreground font-medium">{t('signUpDescription')}</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <User className="w-5 h-5 text-primary" />
              <label className="text-sm font-bold uppercase tracking-wider">{t('fullName')}</label>
            </div>
            <Input
              name="fullName"
              type="text"
              placeholder={t('fullNamePlaceholder')}
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              className={`h-14 text-base rounded-2xl px-5 border-2 font-medium transition-all duration-200 ${
                validationErrors.fullName
                  ? 'border-destructive bg-destructive/5'
                  : 'border-border hover:border-primary focus:border-primary'
              }`}
            />
            {validationErrors.fullName && (
              <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                {t(validationErrors.fullName)}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Mail className="w-5 h-5 text-primary" />
              <label className="text-sm font-bold uppercase tracking-wider">{t('email')}</label>
            </div>
            <Input
              name="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
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

          {/* Password Field */}
          <div className="space-y-2">
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
                validationErrors.password
                  ? 'border-destructive bg-destructive/5'
                  : 'border-border hover:border-primary focus:border-primary'
              }`}
            />
            {formData.password && !validationErrors.password && (
              <PasswordStrengthIndicator password={formData.password} />
            )}
            {validationErrors.password && (
              <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                {t(validationErrors.password)}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Lock className="w-5 h-5 text-primary" />
              <label className="text-sm font-bold uppercase tracking-wider">{t('confirmPassword')}</label>
            </div>
            <Input
              name="confirmPassword"
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              value={formData.confirmPassword}
              onChange={handleChange}
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

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
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
            />
            <label htmlFor="terms" className="text-sm font-medium leading-relaxed cursor-pointer">
              {t('agreeTerms')} <span className="text-primary font-bold">{t('termsLink')}</span>
            </label>
          </div>
          {validationErrors.terms && (
            <p className="text-sm font-semibold text-destructive flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              {t(validationErrors.terms)}
            </p>
          )}

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
                <span>{t('signUp')}</span>
                <ArrowRight className="w-5 h-5" />
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
              className="font-black text-primary hover:text-primary/80 transition-colors"
            >
              {t('logIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
