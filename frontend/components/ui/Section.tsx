import { HTMLAttributes, ReactNode } from 'react';
import { Button } from './Button';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  children: ReactNode;
}

function Section({
  title,
  subtitle,
  ctaText,
  ctaHref,
  children,
  className = '',
  ...props
}: SectionProps) {
  return (
    <section className={`section-shell ${className}`} {...props}>
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-10">
        <div className="space-y-2">
          <h2>{title}</h2>
          {subtitle && (
            <p className="text-gray-400 max-w-xl">{subtitle}</p>
          )}
        </div>
        {ctaText && ctaHref && (
          <Button variant="secondary" href={ctaHref} className="shrink-0">
            {ctaText}
          </Button>
        )}
      </header>
      {children}
    </section>
  );
}

export { Section };
export type { SectionProps };

