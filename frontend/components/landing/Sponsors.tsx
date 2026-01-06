import { Section, Button, Card } from '../ui';

// Placeholder sponsors - replace with real data later
const sponsors = [
  { name: 'Sponsor 1', logo: null },
  { name: 'Sponsor 2', logo: null },
  { name: 'Sponsor 3', logo: null },
  { name: 'Sponsor 4', logo: null },
];

function SponsorPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-20 px-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
      <span className="text-sm text-gray-500">{name}</span>
    </div>
  );
}

export function Sponsors() {
  return (
    <Section
      title="Our Sponsors"
      subtitle="Thank you to the organizations that support our mission."
    >
      <Card className="p-8">
        {/* Sponsor Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {sponsors.map((sponsor) => (
            <SponsorPlaceholder key={sponsor.name} name={sponsor.name} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-4 border-t border-white/5">
          <p className="text-gray-400 mb-4">
            Interested in supporting Asian students in tech?
          </p>
          <Button variant="secondary" href="/contact">
            Become a Sponsor
          </Button>
        </div>
      </Card>
    </Section>
  );
}

