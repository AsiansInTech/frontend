import Stripe from 'stripe';
import { membersRepository } from '../repositories/members.repository';
import { Member, CreateMemberInput } from '../types/content';
import { logger } from '../utils/logger';

/**
 * Calculate the expiration date based on semester rules:
 * - Month 1-5 (Jan-May) → Expiration = May 20 of same year
 * - Month 6-12 (Jun-Dec) → Expiration = Dec 20 of same year
 */
function getExpirationDateForSemester(joinDate: Date): Date {
  const month = joinDate.getMonth(); // 0-indexed: Jan=0, Dec=11
  const year = joinDate.getFullYear();

  // Jan-May (months 0-4) → May 20
  // Jun-Dec (months 5-11) → Dec 20
  return month <= 4
    ? new Date(year, 4, 20) // May 20 (month 4 is May)
    : new Date(year, 11, 20); // Dec 20 (month 11 is Dec)
}

/**
 * Extract a custom field value from Stripe session custom_fields array by key.
 */
function getCustomFieldValue(
  customFields: Stripe.Checkout.Session.CustomField[] | null | undefined,
  key: string
): string | undefined {
  if (!customFields) return undefined;

  const field = customFields.find((f) => f.key === key);
  if (!field) return undefined;

  // Custom fields can be text, dropdown, or numeric
  if (field.text?.value) {
    return field.text.value;
  }
  if (field.dropdown?.value) {
    return field.dropdown.value;
  }
  if (field.numeric?.value) {
    return field.numeric.value;
  }

  return undefined;
}

/**
 * Format a Date to ISO date string (YYYY-MM-DD)
 */
function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const membersService = {
  /**
   * Create or update a member from a Stripe checkout session.
   *
   * Logic:
   * 1. Extract identity (studentId, email) from the session
   * 2. Look up existing member by studentId or email
   * 3. If no existing member → create new member
   * 4. If existing AND active (paid + not expired) → skip, return existing
   * 5. If existing but NOT active → update/renew membership
   */
  createMemberFromStripeSession: async (
    session: Stripe.Checkout.Session
  ): Promise<Member> => {
    // Extract customer details
    const customerDetails = session.customer_details;
    const email = customerDetails?.email || '';
    // Use name if available, fallback to email prefix
    const name = customerDetails?.name || email.split('@')[0] || 'Unknown';
    // Phone comes from customer_details, not custom fields
    const phone = customerDetails?.phone || undefined;

    // Extract custom fields using actual Stripe keys
    const customFields = session.custom_fields;
    const studentId = getCustomFieldValue(customFields, 'uhstudentid');
    const shirtSize = getCustomFieldValue(customFields, 'shirtsize');

    // Calculate dates
    const joinDate = new Date();
    const expirationDate = getExpirationDateForSemester(joinDate);

    logger.info(`Processing checkout for: ${name} (${email})`);

    // Look up existing member
    const existing = await membersRepository.findMemberByStudentIdOrEmail(
      studentId,
      email
    );

    if (!existing) {
      // No existing member → create new
      logger.info(`Creating new member: ${name}`);

      const input: CreateMemberInput = {
        name,
        email,
        studentId,
        phone,
        shirtSize,
        joinDate: toISODateString(joinDate),
        expirationDate: toISODateString(expirationDate),
        paid: true,
      };

      return membersRepository.createMember(input);
    }

    // Existing member found - check if active this semester
    const exp = new Date(existing.expirationDate);
    const now = new Date();
    const isActive =
      existing.paid === true && !Number.isNaN(exp.getTime()) && now <= exp;

    if (isActive) {
      // Already active for this semester → skip
      logger.info(
        `Member ${existing.name} already active for this semester (expires ${existing.expirationDate}), skipping update`
      );
      return existing;
    }

    // Existing but not active → renew membership
    logger.info(`Renewing membership for: ${existing.name}`);

    const updateInput: Partial<CreateMemberInput> = {
      joinDate: toISODateString(joinDate),
      expirationDate: toISODateString(expirationDate),
      paid: true,
    };

    // Optionally update other fields if provided in new checkout
    if (shirtSize) {
      updateInput.shirtSize = shirtSize;
    }
    if (phone) {
      updateInput.phone = phone;
    }
    // Update name if different
    if (name && name !== 'Unknown' && name !== existing.name) {
      updateInput.name = name;
    }

    return membersRepository.updateMember(existing.id, updateInput);
  },
};

