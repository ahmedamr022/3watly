import React from 'react';

interface LogoProps {
  /** Pass null to render the wordmark on its own. */
  tagline?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: { mark: 'h-7 w-7', word: 'text-[18px]', tag: 'text-[10px]' },
  md: { mark: 'h-9 w-9', word: 'text-[22px]', tag: 'text-[11px]' },
  lg: { mark: 'h-11 w-11', word: 'text-[26px]', tag: 'text-[12px]' },
  xl: { mark: 'h-14 w-14', word: 'text-[32px]', tag: 'text-[13.5px]' }
} as const;

export function Logo({ tagline = 'Career Intelligence Platform', size = 'md' }: LogoProps) {
  const { mark, word, tag } = sizes[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Official MAJRA M-Arrow Mark with Gradient */}
      <div className={`${mark} relative flex-shrink-0 flex items-center justify-center`}>
        <img 
          src="/images/logo.png" 
          alt="MAJRA" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex flex-col justify-center leading-tight">
        <span className={`${word} font-black tracking-[-0.03em] text-[#0B132B] dark:text-white transition-colors duration-200`}>
          MAJRA
        </span>
        {tagline && (
          <span className={`mt-0.5 ${tag} font-medium tracking-tight text-[#64748B] dark:text-slate-400`}>
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}