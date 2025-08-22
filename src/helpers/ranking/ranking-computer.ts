import { POINT_ATTRIBUTION_RULES } from "@/constants";
import { Calendar } from "@/types/Calendar";
import { MatchResult } from "@/types/Match";
import { Team } from "@/types/Team";
import { TeamRanking } from "@/types/TeamRanking";
import { getMatchResult } from "./match-computer";
import { sortRanking } from "./ranking-sorter";

export function computeRanking(
  calendar: Calendar,
  teams: Team[]
): TeamRanking[] {
  const table = new Map<string, TeamRanking>();

  const ensureTeamRanked = (teamId: string): TeamRanking => {
    if (!table.has(teamId)) {
      table.set(teamId, createEmptyRanking(teamId));
    }
    return table.get(teamId)!;
  };
  const updateTeamRank = (newTeamRank: TeamRanking) => {
    table.set(newTeamRank.teamId, newTeamRank);
  };

  calendar.forEach((day) => {
    day.forEach((match) => {
      if (match.regularSeason) {
        const home = ensureTeamRanked(match.homeTeamId);
        const away = ensureTeamRanked(match.awayTeamId);

        if (match.simulated) {
          /* SCORE UPDATE */
          home.totalScore.for += match.homeTeamScore;
          home.totalScore.against += match.awayTeamScore;
          away.totalScore.for += match.awayTeamScore;
          away.totalScore.against += match.homeTeamScore;

          /* POINTS & WIN/LOSS/DRAW UPDATE */
          const matchResult = getMatchResult(match);
          if (matchResult.winner === "draw") {
            home.points += POINT_ATTRIBUTION_RULES.DRAW;
            away.points += POINT_ATTRIBUTION_RULES.DRAW;
            home.totalMatches.draws++;
            away.totalMatches.draws++;
          } else {
            const winnerRanking = matchResult.winner === "home" ? home : away;
            const loserRanking = matchResult.winner === "home" ? away : home;
            updateTeamRank(handleWinnerPoints(winnerRanking, matchResult));
            updateTeamRank(handleLoserPoints(loserRanking, matchResult));
          }
        }
      }
    });
  });

  const unsortedRanking = Array.from(table.values());
  const sortedRanking = sortRanking(unsortedRanking, calendar, teams);

  return sortedRanking;
}

function createEmptyRanking(teamId: string): TeamRanking {
  return {
    teamId,
    points: 0,
    bonuses: 0,
    totalMatches: {
      wins: 0,
      draws: 0,
      losses: 0,
    },
    totalScore: {
      for: 0,
      against: 0,
    },
  };
}

function handleWinnerPoints(
  currentRanking: TeamRanking,
  matchResult: MatchResult
): TeamRanking {
  return {
    ...currentRanking,
    totalMatches: {
      ...currentRanking.totalMatches,
      wins: (currentRanking.totalMatches.wins += 1),
    },
    bonuses: currentRanking.bonuses + Number(matchResult.winnerBonus),
    points:
      currentRanking.points +
      POINT_ATTRIBUTION_RULES.WIN +
      Number(matchResult.winnerBonus) * POINT_ATTRIBUTION_RULES.BONUS,
  };
}

function handleLoserPoints(
  currentRanking: TeamRanking,
  matchResult: MatchResult
): TeamRanking {
  return {
    ...currentRanking,
    totalMatches: {
      ...currentRanking.totalMatches,
      losses: (currentRanking.totalMatches.losses += 1),
    },
    bonuses: currentRanking.bonuses + Number(matchResult.loserBonus),
    points:
      currentRanking.points +
      POINT_ATTRIBUTION_RULES.LOSS +
      Number(matchResult.loserBonus) * POINT_ATTRIBUTION_RULES.BONUS,
  };
}
