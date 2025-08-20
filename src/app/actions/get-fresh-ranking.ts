'use server';

import { rankingService } from '@/services/ranking.service';

export async function getFreshRanking() {
  return rankingService.getRanking();
}
