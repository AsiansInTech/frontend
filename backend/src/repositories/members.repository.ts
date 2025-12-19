import { notionClient } from './notion/notionClient';
import { config } from '../config/env';
import { Member, CreateMemberInput } from '../types/content';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { logger } from '../utils/logger';

type NotionPropertyValue = PageObjectResponse['properties'][string];

const getTitleText = (prop: NotionPropertyValue | undefined): string => {
  if (prop?.type === 'title' && Array.isArray(prop.title)) {
    return prop.title[0]?.plain_text ?? '';
  }
  return '';
};

const getRichText = (prop: NotionPropertyValue | undefined): string => {
  if (prop?.type === 'rich_text' && Array.isArray(prop.rich_text)) {
    return prop.rich_text[0]?.plain_text ?? '';
  }
  return '';
};

const getEmailValue = (prop: NotionPropertyValue | undefined): string => {
  if (prop?.type === 'email' && prop.email) {
    return prop.email;
  }
  return '';
};

const getPhoneValue = (prop: NotionPropertyValue | undefined): string => {
  if (prop?.type === 'phone_number' && prop.phone_number) {
    return prop.phone_number;
  }
  return '';
};

const getSelectValue = (prop: NotionPropertyValue | undefined): string | undefined => {
  if (prop?.type === 'select' && prop.select) {
    return prop.select.name || undefined;
  }
  return undefined;
};

const getDateValue = (prop: NotionPropertyValue | undefined): string => {
  if (prop?.type === 'date' && prop.date?.start) {
    return prop.date.start;
  }
  return '';
};

const getCheckboxValue = (prop: NotionPropertyValue | undefined): boolean => {
  if (prop?.type === 'checkbox') {
    return prop.checkbox;
  }
  return false;
};

const mapPageToMember = (page: PageObjectResponse): Member => {
  const props = page.properties;

  return {
    id: page.id,
    name: getTitleText(props['Name']),
    email: getEmailValue(props['Email']),
    studentId: getRichText(props['Student ID']) || undefined,
    phone: getPhoneValue(props['Phone']) || getRichText(props['Phone']) || undefined,
    shirtSize: getSelectValue(props['Shirt Size']),
    joinDate: getDateValue(props['Join Date']),
    expirationDate: getDateValue(props['Expiration Date']),
    paid: getCheckboxValue(props['Membership Fee Paid']),
  };
};

export const membersRepository = {
  /**
   * Find a member by Student ID or Email.
   * Prefers Student ID if provided, falls back to Email.
   */
  findMemberByStudentIdOrEmail: async (
    studentId?: string,
    email?: string
  ): Promise<Member | null> => {
    if (!notionClient) {
      throw new Error('Notion client is not configured. Check NOTION_TOKEN.');
    }

    if (!config.notionMembersDbId) {
      throw new Error('NOTION_MEMBERS_DB_ID is not set.');
    }

    if (!studentId && !email) {
      return null;
    }

    // Build filter based on what we have
    let response;

    if (studentId && email) {
      // Both provided: search for either
      response = await notionClient.databases.query({
        database_id: config.notionMembersDbId,
        filter: {
          or: [
            {
              property: 'Student ID',
              rich_text: { equals: studentId },
            },
            {
              property: 'Email',
              email: { equals: email },
            },
          ],
        },
      });
    } else if (studentId) {
      // Only studentId
      response = await notionClient.databases.query({
        database_id: config.notionMembersDbId,
        filter: {
          property: 'Student ID',
          rich_text: { equals: studentId },
        },
      });
    } else {
      // Only email
      response = await notionClient.databases.query({
        database_id: config.notionMembersDbId,
        filter: {
          property: 'Email',
          email: { equals: email! },
        },
      });
    }

    const pages = response.results.filter(
      (result): result is PageObjectResponse => 'properties' in result
    );

    if (pages.length === 0) {
      return null;
    }

    // If we have studentId match, prefer that over email match
    if (studentId) {
      const studentIdMatch = pages.find((page) => {
        const sid = getRichText(page.properties['Student ID']);
        return sid === studentId;
      });
      if (studentIdMatch) {
        return mapPageToMember(studentIdMatch);
      }
    }

    // Otherwise return first match (email match)
    return mapPageToMember(pages[0]);
  },

  /**
   * Create a new member in the Notion database.
   */
  createMember: async (input: CreateMemberInput): Promise<Member> => {
    logger.info(`Creating member in Notion: ${JSON.stringify(input)}`);

    if (!notionClient) {
      throw new Error('Notion client is not configured. Check NOTION_TOKEN.');
    }

    if (!config.notionMembersDbId) {
      throw new Error('NOTION_MEMBERS_DB_ID is not set.');
    }

    logger.info(`Using Notion database ID: ${config.notionMembersDbId}`);

    const properties: Record<string, unknown> = {
      'Name': {
        title: [{ text: { content: input.name } }],
      },
      'Email': {
        email: input.email,
      },
      'Join Date': {
        date: { start: input.joinDate },
      },
      'Expiration Date': {
        date: { start: input.expirationDate },
      },
      'Membership Fee Paid': {
        checkbox: input.paid,
      },
    };

    if (input.studentId) {
      properties['Student ID'] = {
        rich_text: [{ text: { content: input.studentId } }],
      };
    }

    if (input.phone) {
      properties['Phone'] = {
        phone_number: input.phone,
      };
    }

    if (input.shirtSize) {
      properties['Shirt Size'] = {
        select: { name: input.shirtSize },
      };
    }

    const response = await notionClient.pages.create({
      parent: { database_id: config.notionMembersDbId },
      properties: properties as Parameters<typeof notionClient.pages.create>[0]['properties'],
    });

    return mapPageToMember(response as PageObjectResponse);
  },

  /**
   * Update an existing member in the Notion database.
   */
  updateMember: async (
    memberId: string,
    input: Partial<CreateMemberInput>
  ): Promise<Member> => {
    if (!notionClient) {
      throw new Error('Notion client is not configured. Check NOTION_TOKEN.');
    }

    const properties: Record<string, unknown> = {};

    if (input.name !== undefined) {
      properties['Name'] = {
        title: [{ text: { content: input.name } }],
      };
    }

    if (input.email !== undefined) {
      properties['Email'] = {
        email: input.email,
      };
    }

    if (input.studentId !== undefined) {
      properties['Student ID'] = {
        rich_text: [{ text: { content: input.studentId } }],
      };
    }

    if (input.phone !== undefined) {
      properties['Phone'] = {
        phone_number: input.phone,
      };
    }

    if (input.shirtSize !== undefined) {
      properties['Shirt Size'] = {
        select: { name: input.shirtSize },
      };
    }

    if (input.joinDate !== undefined) {
      properties['Join Date'] = {
        date: { start: input.joinDate },
      };
    }

    if (input.expirationDate !== undefined) {
      properties['Expiration Date'] = {
        date: { start: input.expirationDate },
      };
    }

    if (input.paid !== undefined) {
      properties['Membership Fee Paid'] = {
        checkbox: input.paid,
      };
    }

    const response = await notionClient.pages.update({
      page_id: memberId,
      properties: properties as Parameters<typeof notionClient.pages.update>[0]['properties'],
    });

    return mapPageToMember(response as PageObjectResponse);
  },
};

