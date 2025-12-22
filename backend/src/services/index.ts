import { healthRepository } from '../repositories';
import { eventService } from './eventService';

export const healthService = {
  getHealth: async (): Promise<{ status: string }> => {
    return healthRepository.getHealth();
  },
};

export { officersService } from './officers.service';
export { eventService };
export { membersService } from './members.service';

