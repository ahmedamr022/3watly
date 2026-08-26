import React from 'react';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';

type FieldIcon = 'mail' | 'lock' | 'user';

const icons: Record<FieldIcon, typeof MailIcon> = {
  mail: MailIcon,
  lock: LockIcon,
  user: UserIcon
};

interface TextFieldProps {
  id: string;
  label: string;
  placeholder: string;
  icon: FieldIcon;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextField({
  id,
  label,
  placeholder,
  icon,
  type = 'text',
  autoComplete,
  value,
  onChange
}: TextFieldProps) {
  const [revealed, setRevealed] = React.useState(false);
  const Icon = icons[icon];
  const isPassword = type === 'password';
  const inputType = isPassword && revealed ? 'text' : type;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-[#1E293B] dark:text-slate-200">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 dark:text-slate-400"
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <input
          id={id}
          name={id}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-[50px] w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-[#F8FAFC] dark:bg-[#131C31] pl-11 ${
            isPassword ? 'pr-11' : 'pr-4'
          } text-[14.5px] font-medium text-[#0B132B] dark:text-white shadow-sm outline-none transition-[border-color,box-shadow,background-color] duration-150 ease-smooth placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#2563EB] dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-[#18243E] focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((prev) => !prev)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 dark:text-slate-400 transition-colors duration-150 ease-smooth hover:text-slate-600 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer"
          >
            {revealed ? (
              <EyeOffIcon className="h-4.5 w-4.5" strokeWidth={1.8} />
            ) : (
              <EyeIcon className="h-4.5 w-4.5" strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}