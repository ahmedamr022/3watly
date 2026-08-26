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
import { passwordRules, signUpFeatures } from '@/data/features';
import { Briefcase, BarChart2, FileText } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [agreed, setAgreed] = React.useState(true);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between">
      <Decor />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full border-b border-slate-100 dark:border-white/[0.06] bg-white/80 dark:bg-[#060913]/80 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo tagline="Career Intelligence" size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-[#475569] dark:text-slate-300">
            <Link href="/#features" className="hover:text-[#2563EB] dark:hover:text-white transition-colors flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400" />
              Jobs
            </Link>
            <Link href="/#market-insights" className="hover:text-[#2563EB] dark:hover:text-white transition-colors flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-slate-400" />
              Market Insights
            </Link>
            <Link href="/#how-it-works" className="hover:text-[#2563EB] dark:hover:text-white transition-colors flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              CV Builder
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-[14px] font-bold text-[#1E293B] dark:text-white hover:text-[#2563EB] dark:hover:text-indigo-400 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="hidden sm:inline-flex px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13.5px] font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-12 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-12 lg:py-12">
        {/* Left Column: Brand & Features */}
        <section className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-500/30 px-3.5 py-1.5 shadow-sm">
            <Sparkle className="h-4 w-4 text-[#4F46E5] dark:text-indigo-400" />
            <span className="text-[12.5px] font-bold text-[#4F46E5] dark:text-indigo-300">
              AI-Powered Career Intelligence
            </span>
          </span>

          <h1 className="mt-5 text-[34px] sm:text-[42px] font-black leading-[1.12] tracking-[-0.035em] text-[#0B132B] dark:text-white">
            Create Your Account,
            <br />
            Unlock{' '}
            <span className="relative inline-block text-[#2563EB] dark:text-[#60A5FA]">
              Your Future
              <Underline className="absolute -bottom-2 left-0 h-[11px] w-full" />
            </span>
          </h1>

          <p className="mt-4 max-w-[26rem] text-[15px] font-normal leading-[1.65] text-[#5B6579] dark:text-slate-300">
            Join thousands of professionals using AI to discover insights, build skills, and grow their careers with confidence.
          </p>

          <div className="mt-8">
            <FeatureList features={signUpFeatures} />
          </div>

          <div className="mt-8 flex items-center justify-start">
            <Illustration className="h-auto w-full max-w-[290px]" />
          </div>

          <div className="mt-6 border-t border-slate-200/70 dark:border-white/10 pt-4">
            <SecurityNote
              align="left"
              subtext="We never share your information with third parties."
            />
          </div>
        </section>

        {/* Right Column: Auth Form Card */}
        <section className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[540px] rounded-[28px] border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0D1527] p-7 sm:p-10 shadow-[0_20px_50px_rgba(27,45,105,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.06)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                <Sparkle className="h-5 w-5 text-[#4F46E5] dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-[26px] font-black leading-tight tracking-[-0.025em] text-[#0B132B] dark:text-white">
                  Create Your Account
                </h2>
                <p className="mt-0.5 text-[13.5px] font-normal text-[#5B6579] dark:text-slate-400">
                  Sign up to start your journey with MAJRA
                </p>
              </div>
            </div>

            <div className="mt-7">
              <SocialAuthButtons
                googleLabel="Sign up with Google"
                linkedinLabel="Sign up with LinkedIn"
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
                id="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                icon="user"
                autoComplete="name"
                value={fullName}
                onChange={setFullName}
              />

              <TextField
                id="email"
                label="Email Address"
                placeholder="Enter your email address"
                icon="mail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={setEmail}
              />

              <div>
                <TextField
                  id="password"
                  label="Password"
                  placeholder="Create a strong password"
                  icon="lock"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={setPassword}
                />

                <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                  {passwordRules.map((rule) => (
                    <li key={rule} className="flex items-center gap-1.5">
                      <span className="h-[6px] w-[6px] rounded-full bg-[#10B981]" />
                      <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-1">
                <Checkbox id="terms" checked={agreed} onChange={setAgreed}>
                  I agree to the{' '}
                  <a
                    href="#"
                    className="font-semibold text-[#2563EB] dark:text-[#818CF8] hover:underline"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    className="font-semibold text-[#2563EB] dark:text-[#818CF8] hover:underline"
                  >
                    Privacy Policy
                  </a>
                </Checkbox>
              </div>

              <div className="pt-2">
                <SubmitButton label="Create Account" />
              </div>
            </form>

            <p className="mt-6 text-center text-[14px] font-normal text-[#5B6579] dark:text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-[#2563EB] dark:text-[#818CF8] hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-4 text-center text-[12px] text-slate-400 dark:text-slate-500">
        © 2026 MAJRA. All rights reserved.
      </footer>
    </div>
  );
}
