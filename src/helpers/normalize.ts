import { FINALS_DAY_FORMAT } from '@/constants';

export function normalizeFinalDay(finalDay: string): string {
  const finalsDays = [...FINALS_DAY_FORMAT];

  switch (finalDay) {
    case finalsDays[0]:
      return 'PlayOffs';
    case finalsDays[1]:
      return 'SemiFinals';
    case finalsDays[2]:
      return 'Final';
    default:
      throw new Error('Non existing final in the competition');
  }
}
