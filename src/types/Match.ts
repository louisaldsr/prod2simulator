export interface Match {
  readonly id: string;
  readonly dayNumber: number;
  homeTeamId: string;
  homeTeamScore: number;
  awayTeamId: string;
  awayTeamScore: number;
  simulated: boolean;
  regularSeason: boolean;
}

export type MatchSide = "home" | "away";

export interface MatchResult {
  winner: MatchSide | "draw";
  winnerTeamId: string;
  winnerBonus: boolean;
  loserBonus: boolean;
  winnerScore: number;
  loserScore: number;
}
