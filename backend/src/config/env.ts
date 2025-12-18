import { logger } from '../utils/logger';

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  notionToken: process.env.NOTION_TOKEN,
  notionOfficersDbId: process.env.NOTION_OFFICERS_DB_ID,
};

if (!config.notionToken) {
  logger.warn('NOTION_TOKEN is not set. Notion integration will not work.');
}

if (!config.notionOfficersDbId) {
  logger.warn('NOTION_OFFICERS_DB_ID is not set. Officers endpoint will not work.');
}

