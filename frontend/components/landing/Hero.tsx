import Image from 'next/image';
import { Button } from '../ui';

const benefits = [
  'Workshops',
  'Mentorship',
  'Projects',
  'Career Prep',
];

export function Hero() {
  return (
    <section className="hero-section relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle gradient */}
        <div className="absolute top-0 right-0 w-[60%] h-[60%] rounded-full bg-white/[0.02] blur-[120px]" />
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="page-shell relative z-10 w-full py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          {/* Left Column - Text Content */}
          <div className="max-w-xl space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-medium text-gray-400 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              University of Houston Student Org
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-white">Asians</span>{' '}
              <span className="text-gray-400">in Tech</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
              example text
            </p>

            {/* Benefit chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08]"
                >
                  {benefit}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                href="/join" 
                className="px-7 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0c]"
              >
                Become a Member
              </Button>
              <Button
                variant="secondary"
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 text-base focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#0a0a0c]"
              >
                Join our Discord
              </Button>
            </div>
          </div>

          {/* Right Column - Logo with white background */}
          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              {/* White container with logo */}
              <div className="absolute inset-0 rounded-3xl bg-white shadow-2xl shadow-white/10 overflow-hidden">
                {/* Logo */}
                <div className="absolute inset-6">
                  {/* Using img tag for .ico compatibility */}
                  <img
                    src="/AiT_Logo.ico"
                    alt="AiT Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              {/* Decorative outer ring */}
              <div className="absolute -inset-3 rounded-[2rem] border border-white/[0.08]" />
            </div>
          </div>
        </div>

        {/* Mobile Logo - shown below content on small screens */}
        <div className="md:hidden mt-12 flex justify-center">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 rounded-2xl bg-white shadow-xl overflow-hidden">
              <div className="absolute inset-4">
                <img
                  src="/AiT_Logo.ico"
                  alt="AiT Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
