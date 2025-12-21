export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiGet<T>(
  path: string,
  options?: { signal?: AbortSignal }
): Promise<T> {
  const url = `${API_BASE_URL}/api${path}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: options?.signal,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API Error ${response.status}: ${errorBody || response.statusText}`
    );
  }

  return response.json();
}
