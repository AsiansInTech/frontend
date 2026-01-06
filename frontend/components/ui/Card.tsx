import { forwardRef, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const interactiveStyles =
      variant === 'interactive'
        ? 'cursor-pointer hover:scale-[1.02] hover:border-white/12'
        : '';

    return (
      <div
        ref={ref}
        className={`glass-card p-5 ${interactiveStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
export type { CardProps };

