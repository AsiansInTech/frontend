import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { membersService } from '../services/members.service';
import { created, badRequest, conflict } from '../utils/httpResponses';

const ALLOWED_MAJORS = [
  'Computer Science',
  'Computer Engineering',
  'Electrical Engineering',
  'Industrial Engineering',
  'Mechanical Engineering',
  'Management Information Systems (MIS)',
  'Computer Information Systems',
  'Mathematics',
  'Other',
] as const;

const NAME_PATTERN = /^[A-Za-z\s\-'.]+$/;
const STUDENT_ID_PATTERN = /^\d{7}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createMemberSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less')
    .trim()
    .refine((val) => NAME_PATTERN.test(val), {
      message: 'First name must contain only letters (no numbers or special characters)',
    }),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less')
    .trim()
    .refine((val) => NAME_PATTERN.test(val), {
      message: 'Last name must contain only letters (no numbers or special characters)',
    }),
  studentId: z.string()
    .trim()
    .refine((val) => STUDENT_ID_PATTERN.test(val), {
      message: 'Student ID must be exactly 7 digits',
    }),
  major: z.enum(ALLOWED_MAJORS, {
    errorMap: () => ({ message: 'Please select a valid major from the list' }),
  }),
  majorOther: z.string()
    .max(100, 'Major (Other) must be 100 characters or less')
    .trim()
    .optional(),
  email: z.string()
    .trim()
    .toLowerCase()
    .refine((val) => EMAIL_PATTERN.test(val), {
      message: 'Please enter a valid email address (e.g., user@example.com)',
    }),
}).refine(
  (data) => data.major !== 'Other' || (data.majorOther && data.majorOther.trim().length > 0),
  { message: 'Please specify your major when selecting "Other"', path: ['majorOther'] }
);

export const membersController = {
  createMember: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validationResult = createMemberSchema.safeParse(req.body);
      if (!validationResult.success) {
        badRequest(res, validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '));
        return;
      }

      const member = await membersService.createMember(validationResult.data);
      created(res, { member });
    } catch (error: any) {
      if (error.message === 'Member already exists with this email or student ID') {
        conflict(res, 'Member already exists with this email or student ID');
        return;
      }
      next(error);
    }
  },
};


