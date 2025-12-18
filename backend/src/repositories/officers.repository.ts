import { notionClient } from './notion/notionClient';
import { config } from '../config/env';
import { Officer } from '../types/content';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

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
  if (prop?.type === 'status' && prop.status) {
    return prop.status.name || undefined;
  }
  return undefined;
};

const getNumberValue = (prop: NotionPropertyValue | undefined): number | undefined => {
  if (prop?.type === 'number' && prop.number !== null) {
    return prop.number;
  }
  return undefined;
};

const getUrlValue = (prop: NotionPropertyValue | undefined): string | undefined => {
  if (prop?.type === 'url') {
    return prop.url || undefined;
  }
  return undefined;
};

const getFileUrl = (prop: NotionPropertyValue | undefined): string | undefined => {
  if (prop?.type === 'files' && Array.isArray(prop.files) && prop.files.length > 0) {
    const file = prop.files[0];
    if (file.type === 'external') return file.external.url;
    if (file.type === 'file') return file.file.url;
  }
  return undefined;
};

const mapPageToOfficer = (page: PageObjectResponse): Officer => {
  const props = page.properties;

  return {
    id: page.id,
    name: getTitleText(props.name) || getTitleText(props.Name),
    position: getSelectValue(props.position) || getSelectValue(props.Position) || '',
    status: getSelectValue(props.status) || getSelectValue(props.Status),
    studentId: getNumberValue(props.student_id) || getNumberValue(props.Student_id),
    imageUrl: getFileUrl(props.image) || getFileUrl(props.Image) || getUrlValue(props.image) || getUrlValue(props.Image),
    major: getSelectValue(props.major) || getSelectValue(props.Major),
    linkedinUrl: getUrlValue(props.linkedin) || getUrlValue(props.LinkedIn),
  };
};

export const officersRepository = {
  getOfficers: async (): Promise<Officer[]> => {
    if (!notionClient) {
      throw new Error('Notion client is not configured. Check NOTION_TOKEN.');
    }

    if (!config.notionOfficersDbId) {
      throw new Error('NOTION_OFFICERS_DB_ID is not set.');
    }

    const response = await notionClient.databases.query({
      database_id: config.notionOfficersDbId,
    });

    const pages = response.results.filter(
      (result): result is PageObjectResponse => 'properties' in result
    );

    return pages.map(mapPageToOfficer);
  },
};
