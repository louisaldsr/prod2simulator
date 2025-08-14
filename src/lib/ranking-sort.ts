import { Team } from '@/types/Team';
import { TeamRanking } from '@/types/TeamRanking';

/**
 * Reminder on rules in case of points equality
 * https://top14.lnr.fr/actualite/rappel-du-reglement-en-cas-d-egalite-et-tous-les-cas-possibles
 */
export function rankingSort(
  ranking: TeamRanking[],
  teams: Team[]
): TeamRanking[] {
  return ranking.sort((teamA, teamB) => {
    /* Rule #1: Points */
    if (teamA.points !== teamB.points) {
      return teamB.points - teamA.points;
    }

    /* Rule #2: Direct Confrontation */

    /* Rule #3: Goal-average all season */
    const diffA = teamA.totalScore.for - teamA.totalScore.against;
    const diffB = teamB.totalScore.for - teamB.totalScore.against;
    if (diffA !== diffB) {
      return diffB - diffA;
    }

    /* Rule #4: Goal-average direct confrontation */
    /* Rule #5: Tries difference direct confrontation  */
    /* Rule #6: Tries difference all season  */

    /* Rule #7: Most points scored in all season  */
    if (teamA.totalScore.for !== teamB.totalScore.for) {
      return teamB.totalScore.for - teamA.totalScore.for;
    }

    /* Rule #8: Most tries score in all season  */

    /* By Default: Alphabetical Order */
    const getTeamName = (id: string): string => {
      const team = teams.find((team) => team.id === id);
      if (!team) {
        return 'To be determined';
      }
      return team.name;
    };
    const teamAName = getTeamName(teamA.teamId);
    const teamBName = getTeamName(teamB.teamId);
    return teamAName.toLowerCase().localeCompare(teamBName.toLowerCase());
  });
}
