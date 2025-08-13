'use server';

import { calendarRepository } from '@/repositories/calendar-repository';
import { TeamRanking } from '@/types/TeamRanking';

export async function updateCalendarFinals(
  ranking: TeamRanking[]
): Promise<void> {
  calendarRepository.updateFinalsOnRegularChange(ranking);
}
