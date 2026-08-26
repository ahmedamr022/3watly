"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Decor } from '@/components/brand/Decor';
import { FeatureList } from '@/components/brand/FeatureList';
import { Illustration } from '@/components/brand/Illustration';
import { Logo } from '@/components/brand/Logo';
import { SecurityNote } from '@/components/brand/SecurityNote';
import { Sparkle } from '@/components/brand/Sparkle';
import { Underline } from '@/components/brand/Underline';
import { Checkbox } from '@/components/Form/Checkbox';
import { Divider } from '@/components/Form/Divider';
import { SocialAuthButtons } from '@/components/Form/SocialAuthButtons';
import { SubmitButton } from '@/components/Form/SubmitButton';
import { TextField } from '@/components/Form/TextField';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { loginFeatures } from '@/data/features';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { isAr, t } = useLanguage();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between">
      <Decor />

      {/* Floating Language & Theme Toggles in Top Corner */}
      <div className="absolute top-6 ltr:right-6 rtl:left-6 lg:top-8 lg:ltr:right-10 lg:rtl:left-10 z-30 flex items-center gap-2.5">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Main Grid Content */}
      <main className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-12 lg:py-16">
        {/* Left Column: Brand & Features */}
        <section className="flex flex-col">
          <Link href="/" className="inline-block w-fit transition-transform hover:scale-105">
            <Logo size="md" />
          </Link>

          <h1 className="mt-8 text-[34px] sm:text-[44px] font-black leading-[1.15] tracking-tight text-[#0B132B] dark:text-white">
            {isAr ? (
              <>
                قرارات مهنية أذكى
                <br />
                تبدأ من{' '}
                <span className="relative inline-block bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">
                  هنا
                  <Underline className="absolute -bottom-2 left-0 h-[11px] w-full" />
                </span>
              </>
            ) : (
              <>
                Smarter Career
                <br />
                Decisions Start{' '}
                <span className="relative inline-block bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">
                  Here
                  <Underline className="absolute -bottom-2 left-0 h-[11px] w-full" />
                </span>
              </>
            )}
          </h1>

          <p className="mt-4 max-w-[26rem] text-[15px] font-normal leading-[1.65] text-[#5B6579] dark:text-slate-300">
            {isAr 
              ? "سجّل دخولك لمتابعة خطتك المهنية وسد فجوات مهاراتك والوصول لأحدث وظائف السوق المصري."
              : "Log in to your account and continue building a career you’re proud of."}
          </p>

          <div className="mt-8">
            <FeatureList features={loginFeatures} />
          </div>

          <div className="mt-8 flex items-center justify-start">
            <Illustration className="h-auto w-full max-w-[290px]" />
          </div>

          <div className="mt-6 border-t border-slate-200/70 dark:border-white/10 pt-4">
            <SecurityNote
              align="left"
              subtext={isAr ? "بياناتك مشفرة ومحمية تماماً ولا نشاركها مع أي طرف ثالث." : "We never share your information with third parties."}
            />
          </div>
        </section>

        {/* Right Column: Auth Form Card */}
        <section className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[540px] rounded-[28px] border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0D1527] p-7 sm:p-10 shadow-[0_20px_50px_rgba(27,45,105,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.06)]">
            <div className="flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                <Sparkle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="mt-3 text-[26px] font-black leading-tight tracking-tight text-[#0B132B] dark:text-white">
                {isAr ? "مرحباً بعودتك" : "Welcome Back"}
              </h2>
              <p className="mt-1 text-[13.5px] font-normal text-[#5B6579] dark:text-slate-400">
                {isAr ? "سجّل دخولك لحسابك للمتابعة" : "Log in to your account to continue"}
              </p>
            </div>

            <div className="mt-7">
              <SocialAuthButtons
                googleLabel={isAr ? "المتابعة عبر Google" : "Continue with Google"}
                linkedinLabel={isAr ? "المتابعة عبر LinkedIn" : "Continue with LinkedIn"}
              />
            </div>

            <div className="my-6">
              <Divider />
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                router.push('/onboarding/career-path');
              }}
            >
              <TextField
                id="email"
                label={isAr ? "البريد الإلكتروني" : "Email Address"}
                placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
                icon="mail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={setEmail}
              />

              <TextField
                id="password"
                label={isAr ? "كلمة المرور" : "Password"}
                placeholder={isAr ? "أدخل كلمة المرور" : "Enter your password"}
                icon="lock"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={setPassword}
              />

              <div className="flex items-center justify-between pt-1">
                <Checkbox id="remember" checked={remember} onChange={setRemember}>
                  {isAr ? "تذكر بياناتي" : "Remember me"}
                </Checkbox>
                <a
                  href="#"
                  className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
                </a>
              </div>

              <div className="pt-2">
                <SubmitButton label={isAr ? "تسجيل الدخول" : "Log In"} />
              </div>
            </form>

            <p className="mt-6 text-center text-[14px] font-normal text-[#5B6579] dark:text-slate-400">
              {isAr ? "ليس لديك حساب؟ " : "Don’t have an account? "}
              <Link
                href="/signup"
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {isAr ? "أنشئ حساباً جديداً" : "Sign up"}
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
