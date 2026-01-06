import { membersRepository } from '../repositories/members.repository';
import { Member, Classification } from '../types/content';

export interface CreateMemberInput {
  firstName: string;
  lastName: string;
  studentId: string;
  classification: Classification;
  major: string;
  majorOther?: string;
  minor?: string[];
  email: string;
}

export const membersService = {
  createMember: async (data: CreateMemberInput): Promise<Member> => {
    const normalizedEmail = data.email.trim().toLowerCase();

    const isDuplicate = await membersRepository.checkDuplicate(normalizedEmail, data.studentId);
    if (isDuplicate) {
      throw new Error('Member already exists with this email or student ID');
    }

    return membersRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      studentId: data.studentId,
      classification: data.classification,
      major: data.major,
      majorOther: data.majorOther,
      minor: data.minor,
      email: normalizedEmail,
    });
  },
};


