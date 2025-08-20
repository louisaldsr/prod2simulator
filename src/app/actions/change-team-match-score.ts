'use server';

import { calendarService } from '@/services/calendar.service';

export async function changeMatchScore(
  matchId: string,
  newScore: [number | null, number | null]
): Promise<void> {
  calendarService.updateMatchScore(matchId, newScore);
}
