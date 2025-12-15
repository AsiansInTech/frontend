export const healthRepository = {
  getHealth: async (): Promise<{ status: string }> => {
    return { status: 'ok' };
  },
};

