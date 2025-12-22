import { membersRepository } from '../repositories/members.repository';
import { Member } from '../types/content';

export interface CreateMemberInput {
  firstName: string;
  lastName: string;
  studentId: string;
  major: string;
  majorOther?: string;
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
      major: data.major,
      majorOther: data.majorOther,
      email: normalizedEmail,
    });
  },
};


