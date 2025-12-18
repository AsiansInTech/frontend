import { healthRepository } from '../repositories';

export const healthService = {
  getHealth: async (): Promise<{ status: string }> => {
    return healthRepository.getHealth();
  },
};

export { officersService } from './officers.service';

