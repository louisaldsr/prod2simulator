'use server';

import { calendarRepository } from '@/repositories/calendar-repository';

export async function changeTeamMatchScore(
  matchId: string,
  teamId: string,
  score: number
): Promise<void> {
  calendarRepository.updateMatchScore(
    matchId,
    teamId,
    score
  );
}
