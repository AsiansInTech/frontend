'use client';

import { useEffect, useMemo, useState } from 'react';
import { getOfficers, Officer } from '../../services/officers';

function getRolePriority(role: string): number {
  const lowerRole = role.toLowerCase();
  if (lowerRole === 'president') return 0;
  if (lowerRole.includes('vice president') || lowerRole === 'vp') return 1;
  return 2;
}

function sortOfficers(officers: Officer[]): Officer[] {
  return [...officers].sort((a, b) => {
    const priorityA = getRolePriority(a.role);
    const priorityB = getRolePriority(b.role);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const roleCompare = a.role.localeCompare(b.role);
    if (roleCompare !== 0) {
      return roleCompare;
    }

    return a.name.localeCompare(b.name);
  });
}

export default function OfficersPage() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedOfficers = useMemo(() => sortOfficers(officers), [officers]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOfficers() {
      try {
        setLoading(true);
        setError(null);
        const data = await getOfficers(controller.signal);
        setOfficers(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load officers');
      } finally {
        setLoading(false);
      }
    }

    fetchOfficers();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="section-shell space-y-12 md:space-y-16">
      <header className="space-y-4">
        <h1>Our Officers</h1>
        <p className="max-w-2xl text-gray-300">
          Meet the team leading Asians in Tech this year. Feel free to reach out directly!
        </p>
      </header>

      {error && (
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-gray-100 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-5 space-y-4 animate-pulse">
              <div className="aspect-square rounded-xl bg-white/10" />
              <div className="space-y-2">
                <div className="h-5 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="flex gap-2 pt-2">
                  <div className="flex-1 h-8 bg-white/10 rounded-lg" />
                  <div className="flex-1 h-8 bg-white/10 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedOfficers.map((officer) => (
            <div key={officer.id} className="glass-card p-5 space-y-4">
              <div className="aspect-square rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                {officer.imageUrl ? (
                  <img
                    src={officer.imageUrl}
                    alt={`${officer.name} - ${officer.role}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                    {officer.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-50">{officer.name}</h3>
                <p className="text-sm text-gray-400">{officer.role}</p>
                {officer.major && (
                  <p className="text-xs text-gray-500">{officer.major}</p>
                )}
                {officer.linkedinUrl && (
                  <div className="pt-2">
                    <a
                      href={officer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-xs py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-gray-100 transition"
                      aria-label={`${officer.name} LinkedIn`}
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && sortedOfficers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No officers found.</p>
        </div>
      )}
    </main>
  );
}
