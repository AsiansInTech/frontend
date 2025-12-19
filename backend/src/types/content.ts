// TODO: Expand this with specific interfaces for Events, Officers, Pillars, etc.
export interface BaseEntity {
  id: string;
}

export interface Officer extends BaseEntity {
  name: string;
  position: string;
  status?: string;
  studentId?: number;
  imageUrl?: string;
  major?: string;
  linkedinUrl?: string;
}

export interface Member extends BaseEntity {
  name: string;
  email: string;
  studentId?: string;
  phone?: string;
  shirtSize?: string;
  joinDate: string;
  expirationDate: string;
  paid: boolean; // Maps to "Membership Fee Paid" in Notion
}

export interface CreateMemberInput {
  name: string;
  email: string;
  studentId?: string;
  phone?: string;
  shirtSize?: string;
  joinDate: string;
  expirationDate: string;
  paid: boolean;
}

