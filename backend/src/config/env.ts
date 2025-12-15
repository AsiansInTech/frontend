import { logger } from '../utils/logger';

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  notionToken: process.env.NOTION_TOKEN,
};

if (!config.notionToken) {
  logger.warn('NOTION_TOKEN is not set. Notion integration will not work.');
}

