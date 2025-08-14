import { POINT_ATTRIBUTION_RULES } from '@/constants';
import { Calendar } from '@/types/Calendar';
import { TeamRanking } from '@/types/TeamRanking';

interface MatchResult {
  winner: 'home' | 'away' | 'draw';
  winnerBonus: boolean;
  looserBonus: boolean;
  winnerScore: number;
  looserScore: number;
}

export function computeRanking(calendar: Calendar): TeamRanking[] {
  const table = new Map<string, TeamRanking>();

  const ensureTeamRanked = (id: string): TeamRanking => {
    if (!table.has(id)) {
      table.set(id, emptyRanking(id));
    }
    return table.get(id)!;
  };

  const regularSeasonCalendar = calendar.slice(undefined, -3);
  for (const days of regularSeasonCalendar) {
    for (const match of days) {
      const home = ensureTeamRanked(match.homeTeamId);
      const away = ensureTeamRanked(match.awayTeamId);

      if (match.simulated) {
        /* SCORE UPDATE */
        home.totalScore.for += match.homeTeamScore;
        home.totalScore.against += match.awayTeamScore;
        away.totalScore.for += match.awayTeamScore;
        away.totalScore.against += match.homeTeamScore;

        /* POINTS UPDATE */
        const matchResult = getMatchResult(
          match.homeTeamScore,
          match.awayTeamScore
        );
        if (matchResult.winner === 'home') {
          home.points += POINT_ATTRIBUTION_RULES.WIN;
          home.totalMatches.wins++;
          away.totalMatches.losses++;
          if (matchResult.winnerBonus) {
            home.bonuses += POINT_ATTRIBUTION_RULES.BONUS;
          }
          if (matchResult.looserBonus) {
            away.bonuses += POINT_ATTRIBUTION_RULES.BONUS;
          }
        } else if (matchResult.winner === 'away') {
          away.points += POINT_ATTRIBUTION_RULES.WIN;
          away.totalMatches.wins++;
          home.totalMatches.losses++;
          if (matchResult.winnerBonus) {
            away.bonuses += POINT_ATTRIBUTION_RULES.BONUS;
          }
          if (matchResult.looserBonus) {
            home.bonuses += POINT_ATTRIBUTION_RULES.BONUS;
          }
        } else {
          home.points += POINT_ATTRIBUTION_RULES.DRAW;
          away.points += POINT_ATTRIBUTION_RULES.DRAW;
          home.totalMatches.draws++;
          away.totalMatches.draws++;
        }
      }
    }
  }

  table.forEach((teamRanking) => {
    teamRanking.points += teamRanking.bonuses;
  });

  return Array.from(table.values());
}

export function getMatchResult(
  homeTeamScore: number,
  awayTeamScore: number
): MatchResult {
  if (homeTeamScore > awayTeamScore) {
    return {
      winner: 'home',
      winnerBonus: homeTeamScore >= awayTeamScore + 15,
      looserBonus: awayTeamScore >= homeTeamScore - 5,
      winnerScore: homeTeamScore,
      looserScore: awayTeamScore,
    };
  } else if (homeTeamScore < awayTeamScore) {
    return {
      winner: 'away',
      winnerBonus: awayTeamScore >= homeTeamScore + 15,
      looserBonus: homeTeamScore >= awayTeamScore - 5,
      winnerScore: awayTeamScore,
      looserScore: homeTeamScore,
    };
  } else {
    return {
      winner: 'draw',
      winnerBonus: false,
      looserBonus: false,
      winnerScore: homeTeamScore,
      looserScore: awayTeamScore,
    };
  }
}

function emptyRanking(teamId: string): TeamRanking {
  return {
    teamId,
    points: 0,
    bonuses: 0,
    totalMatches: {
      draws: 0,
      losses: 0,
      wins: 0,
    },
    totalScore: {
      against: 0,
      for: 0,
    },
  };
}
