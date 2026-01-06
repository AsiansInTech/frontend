import { notionClient } from './notion/notionClient';
import { config } from '../config/env';
import { Member, Classification } from '../types/content';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { logger } from '../utils/logger';

type NotionPropertyValue = PageObjectResponse['properties'][string];

const getTitleText = (prop: NotionPropertyValue | undefined): string => {
  if (prop?.type === 'title' && Array.isArray(prop.title)) {
    return prop.title[0]?.plain_text ?? '';
  }
  return '';
};

const getSelectValue = (prop: NotionPropertyValue | undefined): string | undefined => {
  if (prop?.type === 'select' && prop.select) {
    return prop.select.name || undefined;
  }
  return undefined;
};

const getMultiSelectValues = (prop: NotionPropertyValue | undefined): string[] | undefined => {
  if (prop?.type === 'multi_select' && Array.isArray(prop.multi_select)) {
    const values = prop.multi_select.map(item => item.name);
    return values.length > 0 ? values : undefined;
  }
  return undefined;
};

const getEmailValue = (prop: NotionPropertyValue | undefined): string | undefined => {
  if (prop?.type === 'email' && prop.email) {
    return prop.email || undefined;
  }
  return undefined;
};

const getRichTextValue = (prop: NotionPropertyValue | undefined): string | undefined => {
  if (prop?.type === 'rich_text' && Array.isArray(prop.rich_text) && prop.rich_text.length > 0) {
    return prop.rich_text[0]?.plain_text || undefined;
  }
  return undefined;
};

const getDateValue = (prop: NotionPropertyValue | undefined): string | undefined => {
  if (prop?.type === 'date' && prop.date?.start) {
    return prop.date.start;
  }
  return undefined;
};

const mapPageToMember = (page: PageObjectResponse): Member => {
  const props = page.properties;
  const name = getTitleText(props.Name) || getTitleText(props.name);
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Major is multi_select in Notion but we treat it as single value (first item)
  const majorValues = getMultiSelectValues(props.Major);
  const major = majorValues && majorValues.length > 0 ? majorValues[0] : '';

  return {
    id: page.id,
    name,
    firstName,
    lastName,
    studentId: getRichTextValue(props['Student ID']) || '',
    classification: (getSelectValue(props.Classification) as Classification) || 'Freshman',
    major,
    majorOther: getRichTextValue(props['Major (Other)']) || undefined,
    minor: getMultiSelectValues(props.Minor),
    email: getEmailValue(props.Email) || '',
    joinDate: getDateValue(props['Join Date']) || '',
  };
};

export const membersRepository = {
  checkDuplicate: async (email: string, studentId: string): Promise<boolean> => {
    if (!notionClient) {
      throw new Error('Notion client is not initialized. Please set NOTION_TOKEN.');
    }
    if (!config.notionMembersDbId) {
      throw new Error('NOTION_MEMBERS_DB_ID is not set.');
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await notionClient.databases.query({
        database_id: config.notionMembersDbId,
        filter: {
          or: [
            { property: 'Email', email: { equals: normalizedEmail } },
            { property: 'Student ID', rich_text: { equals: studentId } },
          ],
        },
      });
      return response.results.length > 0;
    } catch (error: any) {
      logger.error('Error checking for duplicate member:', error);
      throw new Error(`Failed to check for duplicate member: ${error.message}`);
    }
  },

  create: async (data: {
    firstName: string;
    lastName: string;
    studentId: string;
    classification: Classification;
    major: string;
    majorOther?: string;
    minor?: string[];
    email: string;
  }): Promise<Member> => {
    if (!notionClient) {
      throw new Error('Notion client is not initialized. Please set NOTION_TOKEN.');
    }
    if (!config.notionMembersDbId) {
      throw new Error('NOTION_MEMBERS_DB_ID is not set.');
    }

    try {
      const normalizedEmail = data.email.trim().toLowerCase();
      const fullName = `${data.firstName} ${data.lastName}`;
      const today = new Date().toISOString().split('T')[0];

      const properties: any = {
        'Name': { title: [{ text: { content: fullName } }] },
        'Student ID': { rich_text: [{ text: { content: data.studentId } }] },
        'Classification': { select: { name: data.classification } },
        'Major': { multi_select: [{ name: data.major }] },
        'Email': { email: normalizedEmail },
        'Join Date': { date: { start: today } },
      };

      if (data.majorOther && data.majorOther.trim().length > 0) {
        properties['Major (Other)'] = { rich_text: [{ text: { content: data.majorOther.trim() } }] };
      }

      if (data.minor && data.minor.length > 0) {
        properties['Minor'] = { multi_select: data.minor.map(m => ({ name: m })) };
      }

      const page = await notionClient.pages.create({
        parent: { database_id: config.notionMembersDbId },
        properties,
      }) as PageObjectResponse;

      return mapPageToMember(page);
    } catch (error: any) {
      logger.error('Error creating member in Notion:', error);
      throw new Error(`Failed to create member: ${error.message}`);
    }
  },
};

