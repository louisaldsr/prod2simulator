import { TeamRanking } from '@/types/TeamRanking';

export async function loadRanking(): Promise<TeamRanking[]> {
  const response = await fetch('/api/ranking');
  if (!response.ok) {
    throw new Error('Failed to load ranking data');
  }
  const rankingData: TeamRanking[] = await response.json();
  return rankingData;
}
