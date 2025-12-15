import { Client } from '@notionhq/client';
import { config } from '../../config/env';

// TODO: Wire real Notion queries later.
export const notionClient = config.notionToken
  ? new Client({ auth: config.notionToken })
  : null;

