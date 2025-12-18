export const healthRepository = {
  getHealth: async (): Promise<{ status: string }> => {
    return { status: 'ok' };
  },
};

export { officersRepository } from './officers.repository';

