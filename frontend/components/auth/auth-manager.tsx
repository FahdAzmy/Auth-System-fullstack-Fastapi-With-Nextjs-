'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LoginPage } from './login-page';
import { SignUpPage } from './signup-page';
import { VerifyEmailPage } from './verify-email-page';
import { ForgotPasswordPage } from './forgot-password-page';

type AuthPage = 'login' | 'signup' | 'verify-email' | 'forgot-password';

export function AuthManager() {
  const [currentPage, setCurrentPage] = useState<AuthPage>('login');
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (isRTL) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [isRTL]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onSignUpClick={() => setCurrentPage('signup')}
            onForgotPasswordClick={() => setCurrentPage('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignUpPage
            onSuccess={() => setCurrentPage('verify-email')}
            onLoginClick={() => setCurrentPage('login')}
          />
        );
      case 'verify-email':
        return (
          <VerifyEmailPage
            onSuccess={() => setCurrentPage('login')}
            onBackClick={() => setCurrentPage('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage
            onSuccess={() => setCurrentPage('login')}
            onBackClick={() => setCurrentPage('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden transition-all duration-300 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 ${isRTL ? 'right-1/4' : 'left-1/4'} w-96 h-96 bg-primary/5 rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 ${isRTL ? 'left-1/4' : 'right-1/4'} w-96 h-96 bg-accent/5 rounded-full blur-3xl`} />
      </div>

      {/* Switchers - Language and Theme */}
      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-50 transition-all duration-300 flex gap-2`}>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {renderPage()}
      </div>
    </div>
  );
}
