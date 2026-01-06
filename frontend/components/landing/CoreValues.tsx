import { Card, Section } from '../ui';

const offerings = [
  {
    title: 'Technical Growth',
    description:
      'Learn new skills and technologies through hands-on experiences and peer collaboration.',
  },
  {
    title: 'Professional Development',
    description:
      'Prepare for your career with resources, guidance, and connections to industry professionals.',
  },
  {
    title: 'Community',
    description:
      'Join a supportive network of students who share your background and interests in tech.',
  },
  {
    title: 'Events & Activities',
    description:
      'Participate in social events, competitions, and activities throughout the semester.',
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
