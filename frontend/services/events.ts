import { apiGet } from '../lib/api';

export type EventStatus = 'confirmed' | 'planned' | 'cancelled';

export interface Event {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  location?: string;
  description?: string;
  status: EventStatus;
  rsvpLink?: string;
}

interface BackendEvent {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  location?: string;
  description?: string;
  status: EventStatus;
  published: boolean;
  rsvpLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EventsResponse {
  events: BackendEvent[];
}

function mapEvent(backendEvent: BackendEvent): Event {
  return {
    id: backendEvent.id,
    name: backendEvent.name,
    date: backendEvent.date,
    endDate: backendEvent.endDate,
    location: backendEvent.location,
    description: backendEvent.description,
    status: backendEvent.status,
    rsvpLink: backendEvent.rsvpLink,
  };
}

/**
 * Get upcoming events sorted by date (soonest first).
 * Filters to only published, non-cancelled events that haven't passed.
 */
export async function getUpcomingEvents(
  limit?: number,
  signal?: AbortSignal
): Promise<Event[]> {
  const response = await apiGet<EventsResponse>('/events', { signal });

  const now = new Date();

  const upcomingEvents = response.events
    // Filter to published and non-cancelled
    .filter((event) => event.published && event.status !== 'cancelled')
    // Filter to future events (or events happening today)
    .filter((event) => {
      const eventDate = new Date(event.date);
      // Consider event "upcoming" if it's today or in the future
      return eventDate >= new Date(now.toDateString());
    })
    // Sort by date ascending (soonest first)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    // Map to frontend type
    .map(mapEvent);

  // Apply limit if specified
  return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
}

/**
 * Get all events (for the events page)
 */
export async function getAllEvents(signal?: AbortSignal): Promise<Event[]> {
  const response = await apiGet<EventsResponse>('/events', { signal });

  return response.events
    .filter((event) => event.published && event.status !== 'cancelled')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(mapEvent);
}

/**
 * Format event date for display
 */
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format event time for display
 */
export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

