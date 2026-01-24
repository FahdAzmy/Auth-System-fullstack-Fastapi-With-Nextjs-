'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { validateVerificationCode, type ValidationErrors } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface VerifyEmailPageProps {
  onSuccess?: () => void;
  onBackClick?: () => void;
}

export function VerifyEmailPage({ onSuccess, onBackClick }: VerifyEmailPageProps) {
  const { t, isRTL } = useLanguage();
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessage({ type: 'success', text: t('emailVerificationSuccess') });
      setCode('');
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

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: t('emailVerificationSuccess') });
      setTimeLeft(60);
      setCanResend(false);
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

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card className="w-full max-w-md shadow-xl border-border/50 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t('verifyEmailTitle')}</CardTitle>
          <CardDescription className="text-base mt-2">{t('verifyEmailDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="code">{t('verificationCode')}</Label>
              <Input
                id="code"
                type="text"
                placeholder={t('verificationCodePlaceholder')}
                value={code}
                onChange={handleCodeChange}
                disabled={isLoading}
                maxLength={6}
                className={`text-center text-2xl tracking-widest font-mono ${
                  errors.code ? 'border-red-500' : ''
                }`}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{t(errors.code)}</p>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {!canResend ? (
                <p>{t('codeExpires')}: {timeLeft}s</p>
              ) : (
                <p>{t('verifyEmailDescription')}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t('loading') : t('verifyButton')}
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={onBackClick}
                disabled={isLoading}
              >
                {t('backToLogin')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={handleResendCode}
                disabled={!canResend || isLoading}
              >
                {t('resendCode')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
