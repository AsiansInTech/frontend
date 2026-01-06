'use client';

import { useEffect, useState } from 'react';
import { Card, Section, Badge, Button, CardSkeleton } from '../ui';
import {
  Event,
  getUpcomingEvents,
  formatEventDate,
  formatEventTime,
} from '../../services/events';

function EventCard({ event }: { event: Event }) {
  return (
    <Card variant="interactive" className="flex flex-col h-full">
      {/* Date Badge */}
      <div className="flex items-start justify-between mb-3">
        <Badge variant="accent">{formatEventDate(event.date)}</Badge>
        {event.status === 'planned' && (
          <Badge variant="muted">Tentative</Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-semibold text-gray-50 line-clamp-2">
          {event.name}
        </h3>

        <div className="space-y-1 text-sm text-gray-400">
          <p>{formatEventTime(event.date)}</p>
          {event.location && (
            <p className="truncate">{event.location}</p>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-gray-500 line-clamp-2 pt-1">
            {event.description}
          </p>
        )}
      </div>

      {/* Action */}
      {event.rsvpLink && (
        <div className="pt-4 mt-auto">
          <Button
            variant="ghost"
            href={event.rsvpLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-[#7DE7D6]"
          >
            RSVP →
          </Button>
        </div>
      )}
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 glass-card">
      <p className="text-gray-400 mb-4">No upcoming events scheduled yet.</p>
      <p className="text-sm text-gray-500">
        Check back soon or follow us on social media for updates!
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-12 glass-card">
      <p className="text-red-400 mb-4">Failed to load events</p>
      <Button variant="secondary" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchEvents = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(false);
      const data = await getUpcomingEvents(3, signal);
      setEvents(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchEvents(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <Section
      title="Upcoming Events"
      subtitle="Join us at our next event and connect with the community."
      ctaText="View All Events"
      ctaHref="/events"
    >
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState onRetry={() => fetchEvents()} />}

      {!loading && !error && events.length === 0 && <EmptyState />}

      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </Section>
  );
}

