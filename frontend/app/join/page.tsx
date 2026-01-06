'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiPost } from '../../lib/api';

const CLASSIFICATIONS = ['Freshman', 'Sophomore', 'Junior', 'Senior'] as const;

const MAJORS = [
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

const MINORS = [
  'Computer Science',
  'Computer Engineering',
  'Electrical Engineering',
  'Industrial Engineering',
  'Mechanical Engineering',
  'Mathematics',
  'Statistics',
  'Business Administration',
  'Finance',
  'Accounting',
  'Marketing',
  'Economics',
  'Psychology',
  'Communications',
  'English',
  'History',
  'Political Science',
  'Sociology',
  'Philosophy',
  'Physics',
  'Chemistry',
  'Biology',
  'Data Science',
  'Cybersecurity',
  'Other',
] as const;

const NAME_PATTERN = /^[A-Za-z\s\-'.]+$/;
const STUDENT_ID_PATTERN = /^\d{7}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const joinFormSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less')
    .refine((val) => NAME_PATTERN.test(val.trim()), {
      message: 'First name must contain only letters',
    }),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less')
    .refine((val) => NAME_PATTERN.test(val.trim()), {
      message: 'Last name must contain only letters',
    }),
  studentId: z.string()
    .min(1, 'Student ID is required')
    .refine((val) => STUDENT_ID_PATTERN.test(val.trim()), {
      message: 'Student ID must be exactly 7 digits',
    }),
  email: z.string()
    .min(1, 'Email is required')
    .refine((val) => EMAIL_PATTERN.test(val.trim()), {
      message: 'Please enter a valid email address',
    }),
  classification: z.enum(CLASSIFICATIONS, {
    errorMap: () => ({ message: 'Please select your classification' }),
  }),
  major: z.enum(MAJORS, {
    errorMap: () => ({ message: 'Please select your major' }),
  }),
  majorOther: z.string().max(100).optional(),
  minor: z.array(z.enum(MINORS)).optional(),
}).refine(
  (data) => data.major !== 'Other' || (data.majorOther && data.majorOther.trim().length > 0),
  { message: 'Please specify your major', path: ['majorOther'] }
);

type JoinFormData = z.infer<typeof joinFormSchema>;

export default function JoinPage() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMinors, setSelectedMinors] = useState<string[]>([]);
  const [minorDropdownOpen, setMinorDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<JoinFormData>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      minor: [],
    },
  });

  const selectedMajor = watch('major');

  const toggleMinor = (minor: string) => {
    const newMinors = selectedMinors.includes(minor)
      ? selectedMinors.filter(m => m !== minor)
      : [...selectedMinors, minor];
    setSelectedMinors(newMinors);
    setValue('minor', newMinors as typeof MINORS[number][]);
  };

  const onSubmit = async (data: JoinFormData) => {
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      await apiPost('/members', {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        studentId: data.studentId.trim(),
        email: data.email.trim().toLowerCase(),
        classification: data.classification,
        major: data.major,
        majorOther: data.majorOther?.trim(),
        minor: data.minor,
      });
      setSubmitStatus('success');
      reset();
      setSelectedMinors([]);
    } catch (error: unknown) {
      setSubmitStatus('error');
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          setErrorMessage('Too many signup attempts. Please wait a few minutes before trying again.');
        } else if (error.message.includes('409')) {
          setErrorMessage('A member with this email or student ID already exists.');
        } else {
          setErrorMessage(error.message || 'Something went wrong. Please try again.');
        }
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };

  if (submitStatus === 'success') {
    return (
      <main className="section-shell">
        <div className="glass-panel p-8 md:p-12 max-w-xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl">Welcome to AiT!</h1>
          <p className="text-gray-300">
            Your membership registration has been submitted successfully. 
            We&apos;re excited to have you join our community!
          </p>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="secondary-cta"
          >
            Register Another Member
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="section-shell">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1>Join AiT</h1>
          <p className="text-gray-300 max-w-lg mx-auto">
            Become a member of Asians in Tech. Fill out the form below to register.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 md:p-8 space-y-6">
          {submitStatus === 'error' && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Name Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                {...register('firstName')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1.5 text-sm text-red-400">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                {...register('lastName')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1.5 text-sm text-red-400">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Student ID */}
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-200 mb-2">
              Student ID *
            </label>
            <input
              type="text"
              id="studentId"
              {...register('studentId')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              placeholder="1234567"
              maxLength={7}
            />
            {errors.studentId && (
              <p className="mt-1.5 text-sm text-red-400">{errors.studentId.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Classification */}
          <div>
            <label htmlFor="classification" className="block text-sm font-medium text-gray-200 mb-2">
              Classification *
            </label>
            <select
              id="classification"
              {...register('classification')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition appearance-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled className="bg-gray-900">Select your classification</option>
              {CLASSIFICATIONS.map((c) => (
                <option key={c} value={c} className="bg-gray-900">{c}</option>
              ))}
            </select>
            {errors.classification && (
              <p className="mt-1.5 text-sm text-red-400">{errors.classification.message}</p>
            )}
          </div>

          {/* Major */}
          <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-200 mb-2">
              Major *
            </label>
            <select
              id="major"
              {...register('major')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition appearance-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled className="bg-gray-900">Select your major</option>
              {MAJORS.map((m) => (
                <option key={m} value={m} className="bg-gray-900">{m}</option>
              ))}
            </select>
            {errors.major && (
              <p className="mt-1.5 text-sm text-red-400">{errors.major.message}</p>
            )}
          </div>

          {/* Major Other (conditional) */}
          {selectedMajor === 'Other' && (
            <div>
              <label htmlFor="majorOther" className="block text-sm font-medium text-gray-200 mb-2">
                Specify Your Major *
              </label>
              <input
                type="text"
                id="majorOther"
                {...register('majorOther')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                placeholder="Enter your major"
              />
              {errors.majorOther && (
                <p className="mt-1.5 text-sm text-red-400">{errors.majorOther.message}</p>
              )}
            </div>
          )}

          {/* Minor (Multiselect) */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Minor(s) <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMinorDropdownOpen(!minorDropdownOpen)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition flex items-center justify-between"
              >
                <span className={selectedMinors.length === 0 ? 'text-gray-500' : ''}>
                  {selectedMinors.length === 0
                    ? 'Select your minor(s)'
                    : `${selectedMinors.length} selected`}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${minorDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {minorDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0c]/98 backdrop-blur-2xl shadow-2xl">
                  {MINORS.map((minor) => (
                    <button
                      key={minor}
                      type="button"
                      onClick={() => toggleMinor(minor)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-white/[0.06] flex items-center gap-3 transition border-b border-white/[0.04] last:border-b-0"
                    >
                      <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition ${
                        selectedMinors.includes(minor) 
                          ? 'bg-white border-white' 
                          : 'border-white/20 bg-white/5'
                      }`}>
                        {selectedMinors.includes(minor) && (
                          <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {minor}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected minors tags */}
            {selectedMinors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedMinors.map((minor) => (
                  <span
                    key={minor}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-200"
                  >
                    {minor}
                    <button
                      type="button"
                      onClick={() => toggleMinor(minor)}
                      className="hover:text-white transition"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitStatus === 'loading'}
            className="primary-cta w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitStatus === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Join AiT'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
