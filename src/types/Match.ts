export interface Match {
  readonly id: string;
  readonly homeTeamId: string;
  homeTeamScore: number;
  readonly awayTeamId: string;
  awayTeamScore: number;
  simulated: boolean;
}
