export interface TeamRanking {
  readonly teamId: string;
  points: number;
  bonuses: number;
  totalMatches: {
    wins: number;
    draws: number;
    losses: number;
  };
  totalScore: {
    for: number;
    against: number;
  };
}
