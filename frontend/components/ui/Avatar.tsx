import { HTMLAttributes } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: 'w-10 h-10', text: 'text-sm' },
  md: { container: 'w-16 h-16', text: 'text-xl' },
  lg: { container: 'w-24 h-24', text: 'text-3xl' },
};

function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className = '',
  ...props
}: AvatarProps) {
  const { container, text } = sizeStyles[size];
  const initials = fallback || alt.charAt(0).toUpperCase();

  return (
    <div
      className={`${container} rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center ${className}`}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className={`${text} font-medium text-gray-400`}>{initials}</span>
      )}
    </div>
  );
}

export { Avatar };
export type { AvatarProps, AvatarSize };

