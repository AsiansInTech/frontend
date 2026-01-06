import { Section, Card } from '../ui';

// Placeholder sponsors - replace with real data/logos later
const sponsors = [
  { name: 'Sponsor 1', logo: null },
  { name: 'Sponsor 2', logo: null },
  { name: 'Sponsor 3', logo: null },
];

// Partner student organizations - replace with real data/logos later
const partners = [
  { name: 'Partner 1', logo: null },
  { name: 'Partner 2', logo: null },
  { name: 'Partner 3', logo: null },
];

function SponsorPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-24 px-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition">
      <span className="text-sm text-gray-400 font-medium">{name}</span>
    </div>
  );
}

function PartnerPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-20 px-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition">
      <span className="text-sm text-gray-400">{name}</span>
    </div>
  );
}

export function Sponsors() {
  return (
    <section className="section-shell space-y-16">
      {/* Sponsors Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-50">
            Our Sponsors
          </h2>
          <p className="text-gray-400">
            Thank you to the companies that believe in what we do.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <SponsorPlaceholder key={sponsor.name} name={sponsor.name} />
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-50">
            Meet Our Partners
          </h2>
          <p className="text-gray-400">
            Student organizations we collaborate with for events and initiatives.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {partners.map((partner) => (
            <PartnerPlaceholder key={partner.name} name={partner.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
