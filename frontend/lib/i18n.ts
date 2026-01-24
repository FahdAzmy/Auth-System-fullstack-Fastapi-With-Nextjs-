export type Language = 'en' | 'ar';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    appTitle: 'Secure Auth',
    appSubtitle: 'Your trusted authentication platform',
    
    // Login
    loginTitle: 'Welcome Back',
    loginDescription: 'Sign in to your account',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    loginButton: 'Sign In',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    signUpLink: 'Sign Up',
    
    // Sign Up
    signUpTitle: 'Create Account',
    signUpDescription: 'Join us today',
    fullName: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    signUpButton: 'Create Account',
    agreeTerms: 'I agree to the',
    termsLink: 'Terms of Service',
    and: 'and',
    privacyLink: 'Privacy Policy',
    haveAccount: 'Already have an account?',
    loginLink: 'Sign In',
    
    // Email Verification
    verifyEmailTitle: 'Verify Email',
    verifyEmailDescription: 'Enter the code sent to your email',
    verificationCode: 'Verification Code',
    verificationCodePlaceholder: '000000',
    verifyButton: 'Verify Email',
    resendCode: 'Resend Code',
    codeExpires: 'Code expires in',
    
    // Forgot Password
    forgotPasswordTitle: 'Reset Password',
    forgotPasswordDescription: 'Enter your email to reset your password',
    forgotPasswordButton: 'Send Reset Link',
    resetPasswordTitle: 'Create New Password',
    resetPasswordDescription: 'Enter your verification code and new password',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Enter new password',
    resetPasswordButton: 'Reset Password',
    backToLogin: 'Back to Login',
    
    // Validation Messages
    requiredField: 'This field is required',
    emailRequired: 'Email is required',
    invalidEmail: 'Please enter a valid email address',
    emailTooLong: 'Email address is too long',
    passwordRequired: 'Password is required',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordTooLong: 'Password is too long',
    passwordWeak: 'Password is too weak. Use uppercase, lowercase, numbers, and symbols',
    passwordMismatch: "Passwords don't match",
    nameRequired: 'Full name is required',
    nameTooShort: 'Name must be at least 2 characters',
    nameTooLong: 'Name is too long',
    nameInvalid: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    codeRequired: 'Verification code is required',
    codeInvalid: 'Verification code must be 6 digits',
    
    // Success/Error Messages
    loginSuccess: 'Login successful!',
    signUpSuccess: 'Account created successfully! Please verify your email.',
    emailVerificationSuccess: 'Email verified successfully!',
    passwordResetSuccess: 'Password reset successfully!',
    loginError: 'Login failed. Please try again.',
    signUpError: 'Sign up failed. Please try again.',
    emailError: 'Something went wrong. Please try again.',
    
    // Language
    language: 'Language',
    english: 'English',
    arabic: 'العربية',
    
    // Loading
    loading: 'Loading...',
    pleaseWait: 'Please wait...',
  },
  ar: {
    // General
    appTitle: 'المصادقة الآمنة',
    appSubtitle: 'منصة المصادقة الموثوقة لديك',
    
    // Login
    loginTitle: 'أهلا بعودتك',
    loginDescription: 'قم بتسجيل الدخول إلى حسابك',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    password: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    loginButton: 'تسجيل الدخول',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    noAccount: 'ليس لديك حساب؟',
    signUpLink: 'إنشاء حساب',
    
    // Sign Up
    signUpTitle: 'إنشاء حساب',
    signUpDescription: 'انضم إلينا اليوم',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'محمد علي',
    confirmPassword: 'تأكيد كلمة المرور',
    confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
    signUpButton: 'إنشاء الحساب',
    agreeTerms: 'أوافق على',
    termsLink: 'شروط الخدمة',
    and: 'و',
    privacyLink: 'سياسة الخصوصية',
    haveAccount: 'هل لديك حساب بالفعل؟',
    loginLink: 'تسجيل الدخول',
    
    // Email Verification
    verifyEmailTitle: 'التحقق من البريد الإلكتروني',
    verifyEmailDescription: 'أدخل الكود المرسل إلى بريدك الإلكتروني',
    verificationCode: 'كود التحقق',
    verificationCodePlaceholder: '000000',
    verifyButton: 'التحقق من البريد',
    resendCode: 'إعادة إرسال الكود',
    codeExpires: 'ينتهي صلاحية الكود في',
    
    // Forgot Password
    forgotPasswordTitle: 'إعادة تعيين كلمة المرور',
    forgotPasswordDescription: 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور',
    forgotPasswordButton: 'إرسال رابط الإعادة',
    resetPasswordTitle: 'إنشاء كلمة مرور جديدة',
    resetPasswordDescription: 'أدخل كود التحقق وكلمة المرور الجديدة',
    newPassword: 'كلمة المرور الجديدة',
    newPasswordPlaceholder: 'أدخل كلمة المرور الجديدة',
    resetPasswordButton: 'إعادة تعيين كلمة المرور',
    backToLogin: 'العودة إلى تسجيل الدخول',
    
    // Validation Messages
    requiredField: 'هذا الحقل مطلوب',
    emailRequired: 'البريد الإلكتروني مطلوب',
    invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    emailTooLong: 'عنوان البريد الإلكتروني طويل جداً',
    passwordRequired: 'كلمة المرور مطلوبة',
    passwordTooShort: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
    passwordTooLong: 'كلمة المرور طويلة جداً',
    passwordWeak: 'كلمة المرور ضعيفة جداً. استخدم أحرفاً كبيرة وصغيرة وأرقاماً ورموز',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    nameRequired: 'الاسم الكامل مطلوب',
    nameTooShort: 'يجب أن يكون الاسم حرفين على الأقل',
    nameTooLong: 'الاسم طويل جداً',
    nameInvalid: 'يمكن للاسم أن يحتوي على أحرف ومسافات وشرطات وعلامات اقتباس فقط',
    codeRequired: 'كود التحقق مطلوب',
    codeInvalid: 'يجب أن يكون كود التحقق 6 أرقام',
    
    // Success/Error Messages
    loginSuccess: 'تم تسجيل الدخول بنجاح!',
    signUpSuccess: 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني.',
    emailVerificationSuccess: 'تم التحقق من البريد الإلكتروني بنجاح!',
    passwordResetSuccess: 'تم إعادة تعيين كلمة المرور بنجاح!',
    loginError: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.',
    signUpError: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
    emailError: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    
    // Language
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    
    // Loading
    loading: 'جاري التحميل...',
    pleaseWait: 'يرجى الانتظار...',
  },
};

export function getTranslation(language: Language, key: string): string {
  return translations[language][key] || key;
}
