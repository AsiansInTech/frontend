import {
  Hero,
  UpcomingEvents,
  CoreValues,
  OfficersPreview,
  Sponsors,
} from '../components/landing';

export default function HomePage() {
  return (
    <>
      <Hero />
      <UpcomingEvents />
      <CoreValues />
      <OfficersPreview />
      <Sponsors />
    </>
  );
}
