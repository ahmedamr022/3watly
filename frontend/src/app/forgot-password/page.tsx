"use client";

import React from 'react';
import Link from 'next/link';
import { Decor } from '@/components/brand/Decor';
import { FeatureList } from '@/components/brand/FeatureList';
import { Illustration } from '@/components/brand/Illustration';
import { Logo } from '@/components/brand/Logo';
import { SecurityNote } from '@/components/brand/SecurityNote';
import { Underline } from '@/components/brand/Underline';
import { Divider } from '@/components/Form/Divider';
import { SubmitButton } from '@/components/Form/SubmitButton';
import { TextField } from '@/components/Form/TextField';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { loginFeatures } from '@/data/features';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { isAr, t } = useLanguage();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      toast.error(isAr ? 'يرجى إدخال بريدك الإلكتروني.' : 'Please enter your email address.');
      return;
    }
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 1500));
    setIsSubmitting(false);
    setIsSent(true);
    toast.success(isAr ? 'تم إرسال رابط إعادة التعيين!' : 'Reset link sent!');
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between">
      <Decor />
      <div className="absolute top-6 ltr:right-6 rtl:left-6 lg:top-8 lg:ltr:right-10 lg:rtl:left-10 z-30 flex items-center gap-2.5">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <main className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-12 lg:py-16">
        <section className="flex flex-col">
          <Link href="/" className="inline-block w-fit transition-transform hover:scale-105">
            <Logo size="md" />
          </Link>
          <h1 className="mt-8 text-[34px] sm:text-[44px] font-black leading-[1.15] tracking-tight text-[#0B132B] dark:text-white">
            {isAr ? (
              <>
                استعد وصولك{' '}
                <span className="relative inline-block bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">
                  بسهولة
                  <Underline className="absolute -bottom-2 left-0 h-[11px] w-full" />
                </span>
              </>
            ) : (
              <>
                Recover Your Account{' '}
                <span className="relative inline-block bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">
                  Easily
                  <Underline className="absolute -bottom-2 left-0 h-[11px] w-full" />
                </span>
              </>
            )}
          </h1>
          <p className="mt-4 max-w-[26rem] text-[15px] font-normal leading-[1.65] text-[#5B6579] dark:text-slate-300">
            {isAr
              ? 'ادخل بريدك الالكتروني وسنرسل لك رابطا لإعادة تعيين كلمة المرور فورا.'
              : "Enter your email and we'll send you a link to reset your password right away."}
          </p>
          <div className="mt-8"><FeatureList features={loginFeatures} /></div>
          <div className="mt-8 flex items-center justify-start">
            <Illustration className="h-auto w-full max-w-[290px]" />
          </div>
          <div className="mt-6 border-t border-slate-200/70 dark:border-white/10 pt-4">
            <SecurityNote align="left" subtext={isAr ? 'بياناتك مشفرة ومحمية تماما ولا نشاركها مع اي طرف ثالث.' : 'We never share your information with third parties.'} />
          </div>
        </section>

        <section className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[540px] rounded-[28px] border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0D1527] p-7 sm:p-10 shadow-[0_20px_50px_rgba(27,45,105,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
            {!isSent ? (
              <>
                <div className="flex flex-col items-center text-center">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="mt-3 text-[26px] font-black leading-tight tracking-tight text-[#0B132B] dark:text-white">
                    {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                  </h2>
                  <p className="mt-1 text-[13.5px] font-normal text-[#5B6579] dark:text-slate-400">
                    {isAr ? 'ادخل بريدك الالكتروني وسنرسل لك رابط إعادة التعيين' : "No worries, we'll send you reset instructions"}
                  </p>
                </div>
                <div className="my-7"><Divider /></div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <TextField id="email" label={isAr ? 'البريد الإلكتروني' : 'Email Address'} placeholder={isAr ? 'ادخل بريدك الالكتروني' : 'Enter your email address'} icon="mail" type="email" autoComplete="email" value={email} onChange={setEmail} />
                  <div className="pt-2">
                    <SubmitButton label={isSubmitting ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link')} />
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-[24px] font-black leading-tight tracking-tight text-[#0B132B] dark:text-white">
                  {isAr ? 'تم الإرسال!' : 'Check Your Email!'}
                </h2>
                <p className="mt-2 text-[13.5px] font-normal text-[#5B6579] dark:text-slate-400 max-w-[340px]">
                  {isAr ? `لقد ارسلنا رابط إعادة تعيين كلمة المرور إلى ${email}. تحقق من بريدك الوارد.` : `We sent a password reset link to ${email}. Please check your inbox.`}
                </p>
                <div className="mt-6 w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-[12.5px] text-slate-500 dark:text-slate-400">
                  {isAr ? 'لم يصلك البريد؟ ' : "Didn't receive the email? "}
                  <button type="button" onClick={() => setIsSent(false)} className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    {isAr ? 'اعد الإرسال' : 'try again'}
                  </button>
                </div>
              </div>
            )}
            <p className="mt-6 text-center text-[14px] font-normal text-[#5B6579] dark:text-slate-400">
              <Link href="/login" className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:underline">
                <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <footer className="relative z-10 py-4 text-center text-[12px] text-slate-400 dark:text-slate-500">
        {t('footerRights')}
      </footer>
    </div>
  );
}
