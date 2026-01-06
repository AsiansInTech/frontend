import { Card, Section } from '../ui';

const offerings = [
  {
    title: 'example title 1',
    description:
      'example text 1',
  },
  {
    title: 'example title 2',
    description:
      'example text 2',
  },
  {
    title: 'example title 3',
    description:
      'example text 3',
  },
  {
    title: 'example title 4',
    description:
      'example text 4',
  },
];

function OfferingCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="space-y-3 h-full">
      <h3 className="text-lg font-semibold text-gray-50">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </Card>
  );
}

export function CoreValues() {
  return (
    <Section
      title="What We Offer"
      subtitle="AiT provides resources and opportunities to help you succeed in tech."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {offerings.map((offering) => (
          <OfferingCard key={offering.title} {...offering} />
        ))}
      </div>
    </Section>
  );
}
