import { apiGet } from '../lib/api';

export interface Officer {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  linkedinUrl?: string;
  major?: string;
}

interface BackendOfficer {
  id: string;
  name: string;
  position: string;
  status?: string;
  studentId?: number;
  imageUrl?: string;
  major?: string;
  linkedinUrl?: string;
}

interface OfficersResponse {
  officers: BackendOfficer[];
}

function mapOfficer(backendOfficer: BackendOfficer): Officer {
  return {
    id: backendOfficer.id,
    name: backendOfficer.name,
    role: backendOfficer.position,
    imageUrl: backendOfficer.imageUrl,
    linkedinUrl: backendOfficer.linkedinUrl,
    major: backendOfficer.major,
  };
}

export async function getOfficers(signal?: AbortSignal): Promise<Officer[]> {
  const response = await apiGet<OfficersResponse>('/officers', { signal });
  return response.officers.map(mapOfficer);
}
