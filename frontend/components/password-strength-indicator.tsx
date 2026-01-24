'use client';

import { getPasswordStrength } from '@/lib/validation';
import { useLanguage } from '@/lib/language-context';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = getPasswordStrength(password);
  const { t } = useLanguage();

  const strengthConfig = {
    weak: { color: 'bg-red-500', label: 'Weak', textColor: 'text-red-600 dark:text-red-400' },
    fair: { color: 'bg-yellow-500', label: 'Fair', textColor: 'text-yellow-600 dark:text-yellow-400' },
    good: { color: 'bg-blue-500', label: 'Good', textColor: 'text-blue-600 dark:text-blue-400' },
    strong: { color: 'bg-green-500', label: 'Strong', textColor: 'text-green-600 dark:text-green-400' },
  };

  const config = strengthConfig[strength];
  const progress = {
    weak: 25,
    fair: 50,
    good: 75,
    strong: 100,
  }[strength];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Password Strength</span>
        <span className={`text-xs font-medium ${config.textColor}`}>{config.label}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${config.color} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground space-y-0.5">
        <div>Use uppercase letters (A-Z), lowercase letters (a-z)</div>
        <div>Include numbers (0-9) and special characters (!@#$%^&*)</div>
      </div>
    </div>
  );
}
