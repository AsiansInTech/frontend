'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, Section, Avatar, Button, AvatarCardSkeleton } from '../ui';
import { getOfficers, Officer } from '../../services/officers';

function getRolePriority(role: string): number {
  const lowerRole = role.toLowerCase();
  if (lowerRole === 'president') return 0;
  if (lowerRole.includes('vice president') || lowerRole === 'vp') return 1;
  if (lowerRole.includes('director')) return 2;
  if (lowerRole.includes('lead')) return 3;
  return 4;
}

function sortOfficers(officers: Officer[]): Officer[] {
  return [...officers].sort((a, b) => {
    const priorityA = getRolePriority(a.role);
    const priorityB = getRolePriority(b.role);
    if (priorityA !== priorityB) return priorityA - priorityB;
    return a.name.localeCompare(b.name);
  });
}

function OfficerCard({ officer }: { officer: Officer }) {
  return (
    <Card className="flex flex-col items-center text-center space-y-3">
      <Avatar src={officer.imageUrl} alt={officer.name} size="lg" />
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-50">{officer.name}</h3>
        <p className="text-sm text-gray-400">{officer.role}</p>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 glass-card">
      <p className="text-gray-400">Officers will be announced soon!</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-12 glass-card">
      <p className="text-red-400 mb-4">Failed to load officers</p>
      <Button variant="secondary" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

export function OfficersPreview() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const sortedOfficers = useMemo(
    () => sortOfficers(officers).slice(0, 8),
    [officers]
  );

  const fetchOfficers = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(false);
      const data = await getOfficers(signal);
      setOfficers(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchOfficers(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <Section
      title="Meet Our Team"
      subtitle="The officers leading Asians in Tech this year."
      ctaText="View All Officers"
      ctaHref="/officers"
    >
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <AvatarCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState onRetry={() => fetchOfficers()} />}

      {!loading && !error && sortedOfficers.length === 0 && <EmptyState />}

      {!loading && !error && sortedOfficers.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sortedOfficers.map((officer) => (
            <OfficerCard key={officer.id} officer={officer} />
          ))}
        </div>
      )}
    </Section>
  );
}
