import { SkinConcernType } from '@/types';

interface IconProps {
  className?: string;
}

export const DrynessIcon = ({ className = "w-8 h-8" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

export const SpotsIcon = ({ className = "w-8 h-8" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const AcneIcon = ({ className = "w-8 h-8" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const PoresIcon = ({ className = "w-8 h-8" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="8" cy="9" r="1.5" />
    <circle cx="16" cy="9" r="1.5" />
    <circle cx="12" cy="14" r="1.5" />
    <circle cx="8" cy="16" r="1" />
    <circle cx="16" cy="16" r="1" />
  </svg>
);

export const WrinklesIcon = ({ className = "w-8 h-8" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8c4-2 6 2 10 0s6-2 8 0" />
    <path d="M3 12c4-2 6 2 10 0s6-2 8 0" />
    <path d="M3 16c4-2 6 2 10 0s6-2 8 0" />
  </svg>
);

export const SaggingIcon = ({ className = "w-8 h-8" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="10" rx="8" ry="6" />
    <path d="M6 14c0 3 2.5 6 6 6s6-3 6-6" />
    <line x1="12" y1="16" x2="12" y2="18" />
    <polyline points="9 17 12 20 15 17" />
  </svg>
);

export const SensitiveIcon = ({ className = "w-8 h-8" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6v2" />
    <path d="M12 16h.01" />
    <path d="M8 10c.5-1 1.5-2 4-2s3.5 1 4 2" />
  </svg>
);

export const getIconComponent = (type: SkinConcernType) => {
  const icons: Record<SkinConcernType, React.FC<IconProps>> = {
    dryness: DrynessIcon,
    spots: SpotsIcon,
    acne: AcneIcon,
    pores: PoresIcon,
    wrinkles: WrinklesIcon,
    sagging: SaggingIcon,
    sensitive: SensitiveIcon,
  };
  return icons[type];
};
