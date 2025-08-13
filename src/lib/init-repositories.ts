import { calendarRepository } from '@/repositories/calendar-repository';
import { teamRepository } from '@/repositories/team-repository';

export async function initializeRepositories() {
  if (calendarRepository.initialized && teamRepository.initialized) return;

  await teamRepository.loadDatabase();
  await calendarRepository.loadDatabase();
}
