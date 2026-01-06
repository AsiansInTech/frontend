import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

function Skeleton({
  variant = 'rectangular',
  className = '',
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={`bg-white/10 animate-pulse ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}

// Pre-built skeleton patterns
function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-5 space-y-4 ${className}`}>
      <Skeleton className="aspect-video w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4 h-5" />
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
    </div>
  );
}

function AvatarCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-5 space-y-4 ${className}`}>
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4 h-5" />
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
    </div>
  );
}

export { Skeleton, CardSkeleton, AvatarCardSkeleton };
export type { SkeletonProps };

