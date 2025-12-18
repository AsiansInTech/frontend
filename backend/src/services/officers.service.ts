import { officersRepository } from '../repositories/officers.repository';
import { Officer } from '../types/content';

export const officersService = {
  getOfficers: async (): Promise<Officer[]> => {
    return officersRepository.getOfficers();
  },
};
