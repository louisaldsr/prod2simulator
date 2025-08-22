import { TeamNotFoundError } from "@/errors/TeamNotFound.error";
import { Calendar } from "@/types/Calendar";
import { Team } from "@/types/Team";
import { TeamRanking } from "@/types/TeamRanking";
import { getMatchResult } from "./match-computer";

export function sortRanking(
  unsortedRanking: TeamRanking[],
  calendar: Calendar,
  teams: Team[]
): TeamRanking[] {
  return unsortedRanking.sort((teamA, teamB) => {
    /* Rule #1: Points */
    if (teamA.points !== teamB.points) {
      return teamB.points - teamA.points;
    }

    /* Rule #2: Direct Confrontation */
    const confrontations = calendar.flat().filter((match) => {
      return (
        match.regularSeason &&
        ((match.homeTeamId === teamA.teamId &&
          match.awayTeamId === teamB.teamId) ||
          (match.homeTeamId === teamB.teamId &&
            match.awayTeamId === teamA.teamId))
      );
    });
    let teamAWins = 0;
    let teamBWins = 0;
    confrontations.forEach((match) => {
      const winnerTeamId = getMatchResult(match).winnerTeamId;
      if (winnerTeamId === teamA.teamId) teamAWins++;
      if (winnerTeamId === teamB.teamId) teamBWins++;
    });
    if (teamAWins !== teamBWins) {
      return teamBWins - teamAWins;
    }

    /* Rule #3: Goal-average all season */
    const diffA = teamA.totalScore.for - teamA.totalScore.against;
    const diffB = teamB.totalScore.for - teamB.totalScore.against;
    if (diffA !== diffB) {
      return diffB - diffA;
    }

    /* Rule #4: Goal-average direct confrontation */
    let confrontationDiffScore = 0; // negative, teamA scored more, positive, teamB scored more
    confrontations.forEach((match) => {
      const teamAScore =
        match.homeTeamId === teamA.teamId
          ? match.homeTeamScore
          : match.awayTeamScore;
      const teamBScore =
        match.homeTeamId === teamA.teamId
          ? match.homeTeamScore
          : match.awayTeamScore;
      return (confrontationDiffScore += teamBScore - teamAScore);
    });
    if (confrontationDiffScore) {
      return confrontationDiffScore;
    }

    /* Rule #5: Tries difference direct confrontation  */
    /* Rule #6: Tries difference all season  */

    /* Rule #7: Most points scored in all season  */
    if (teamA.totalScore.for !== teamB.totalScore.for) {
      return teamB.totalScore.for - teamA.totalScore.for;
    }

    /* Rule #8: Most tries score in all season  */

    /* By Default: Alphabetical Order */
    const getTeamName = (teamId: string) => {
      const team = teams.find((team) => team.id === teamId);
      if (!team) throw new TeamNotFoundError({ id: teamId });
      return team.name;
    };
    const teamAName = getTeamName(teamA.teamId);
    const teamBName = getTeamName(teamB.teamId);
    return teamAName.toLowerCase().localeCompare(teamBName.toLowerCase());
  });
}
