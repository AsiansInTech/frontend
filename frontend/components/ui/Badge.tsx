import { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'accent' | 'muted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-white/10 text-gray-200 border-white/10',
  accent:
    'bg-[#7DE7D6]/15 text-[#7DE7D6] border-[#7DE7D6]/20',
  muted:
    'bg-white/5 text-gray-400 border-white/5',
};

function Badge({
  variant = 'default',
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };

