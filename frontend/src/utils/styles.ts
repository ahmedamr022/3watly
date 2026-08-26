/** Shared surface recipes so every onboarding panel uses the same material. */
export const surface =
'rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_28px_-24px_rgba(27,45,105,0.28)]';

export const surfaceInteractive =
`${surface} transition-[border-color,box-shadow,transform] duration-150 ease-smooth hover:border-[#C6D3EE] hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_18px_36px_-24px_rgba(27,45,105,0.38)] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/20`;

export const rowSurface =
'rounded-xl border border-line bg-white transition-[border-color,background-color,transform] duration-150 ease-smooth';