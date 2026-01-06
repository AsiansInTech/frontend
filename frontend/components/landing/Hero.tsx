import Image from 'next/image';
import { Button } from '../ui';

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Logo - positioned to extend past the right edge */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none opacity-60"
        style={{ right: '-5%', width: '55%', height: '90%' }}
      >
        <Image
          src="/AiT Logo.png"
          alt=""
          fill
          className="object-contain object-center"
          priority
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="page-shell relative z-10 w-full py-16 md:py-24">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase">
            <span className="text-[#7DE7D6]">Asians</span>{' '}
            <span className="text-gray-100">in Tech</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light uppercase tracking-wide">
            We build <span className="text-gray-100 font-medium">community</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button href="/join" className="px-8 py-3 text-base">
              Become a Member
            </Button>
            <Button
              variant="secondary"
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 text-base"
            >
              Join our Discord
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
