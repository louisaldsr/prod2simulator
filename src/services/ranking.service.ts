import { POINT_ATTRIBUTION_RULES } from "@/constants";
import { CalendarRepository } from "@/repositories/calendar.repository";
import { TeamRepository } from "@/repositories/team.repository";
import { Match, MatchResult, MatchSide } from "@/types/Match";
import { TeamRanking } from "@/types/TeamRanking";
import assert from "assert";

export class RankingService {
  public initialized: boolean = false;
  private calendarRepository!: CalendarRepository;
  private teamRepository!: TeamRepository;

  /**
   * Initialize ranking service
   * @param teamRepository
   * @param calendarRepository
   */
  public initialize(
    teamRepository: TeamRepository,
    calendarRepository: CalendarRepository
  ): void {
    if (this.initialized) return;
    assert(teamRepository.initialized === true);
    this.teamRepository = teamRepository;
    assert(calendarRepository.initialized === true);
    this.calendarRepository = calendarRepository;
    this.initialized = true;
  }

  /**
   * Get fresh ranking of all teams if the calendar going over all the matchs of the regular season
   *
   * Ranking is then sorted according to league rules
   */
  public getRanking(): TeamRanking[] {
    const table = new Map<string, TeamRanking>();

    const ensureTeamRanked = (teamId: string): TeamRanking => {
      if (!table.has(teamId)) {
        table.set(teamId, this._createEmptyRanking(teamId));
      }
      return table.get(teamId)!;
    };

    const updateTeamRank = (newTeamRank: TeamRanking) => {
      table.set(newTeamRank.teamId, newTeamRank);
    };

    const calendar = this.calendarRepository.getCalendar();
    const regularSeasonDays = this.calendarRepository.regularSeasonDays;
    const regularSeasonCalendar = calendar.slice(0, regularSeasonDays);

    regularSeasonCalendar.forEach((regularDay) => {
      regularDay.forEach((match) => {
        const home = ensureTeamRanked(match.homeTeamId);
        const away = ensureTeamRanked(match.awayTeamId);

        if (match.simulated) {
          /* SCORE UPDATE */
          home.totalScore.for += match.homeTeamScore;
          home.totalScore.against += match.awayTeamScore;
          away.totalScore.for += match.awayTeamScore;
          away.totalScore.against += match.homeTeamScore;

          /* POINTS & WIN/LOSS/DRAW UPDATE */
          const matchResult = this.getMatchResult(match);
          if (matchResult.winner === "draw") {
            home.points += POINT_ATTRIBUTION_RULES.DRAW;
            away.points += POINT_ATTRIBUTION_RULES.DRAW;
            home.totalMatches.draws++;
            away.totalMatches.draws++;
          } else {
            const winnerRanking = matchResult.winner === "home" ? home : away;
            const loserRanking = matchResult.winner === "home" ? away : home;
            updateTeamRank(
              this._handleWinnerPoints(winnerRanking, matchResult)
            );
            updateTeamRank(this._handleLoserPoints(loserRanking, matchResult));
          }
        }
      });
    });

    return this.sortRanking(Array.from(table.values()));
  }

  /**
   * Provided an initial ranking, sort it according to specific rules of the division
   *
   * Division rules for french rugby league
   * https://top14.lnr.fr/actualite/rappel-du-reglement-en-cas-d-egalite-et-tous-les-cas-possibles
   */
  public sortRanking(ranking: TeamRanking[]): TeamRanking[] {
    return ranking.sort((teamA, teamB) => {
      /* Rule #1: Points */
      if (teamA.points !== teamB.points) {
        return teamB.points - teamA.points;
      }

      /* Rule #2: Direct Confrontation */
      const teamAMatchs = this.calendarRepository.getTeamMatchs(teamA.teamId);
      const confrontations = teamAMatchs.filter((match) => {
        return (
          match.homeTeamId === teamB.teamId || match.awayTeamId === teamB.teamId
        );
      });
      let teamAWins = 0;
      let teamBWins = 0;
      confrontations.forEach((match) => {
        const winnerTeamId = this.getMatchResult(match).winnerTeamId;
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
      const teamAName = this.teamRepository.getTeamById(teamA.teamId).name;
      const teamBName = this.teamRepository.getTeamById(teamB.teamId).name;
      return teamAName.toLowerCase().localeCompare(teamBName.toLowerCase());
    });
  }

  /**
   * For a given match, get the result for points attribution
   */
  public getMatchResult(match: Match): MatchResult {
    if (match.homeTeamScore === match.awayTeamScore) {
      const score = match.homeTeamScore;
      return {
        winner: "draw",
        winnerTeamId: "",
        winnerScore: score,
        loserScore: score,
        winnerBonus: false,
        loserBonus: false,
      };
    } else {
      const winner: MatchSide =
        match.homeTeamScore > match.awayTeamScore ? "home" : "away";
      const winnerTeamId =
        winner === "home" ? match.homeTeamId : match.awayTeamId;
      const winnerScore =
        winner === "home" ? match.homeTeamScore : match.awayTeamScore;
      const loserScore =
        winner === "home" ? match.awayTeamScore : match.homeTeamScore;
      const winnerBonus = this._hasWonWithBonus(winnerScore, loserScore);
      const loserBonus = this._hasLoseWithBonus(winnerScore, loserScore);
      return {
        winner,
        winnerTeamId,
        winnerScore,
        loserScore,
        winnerBonus,
        loserBonus,
      };
    }
  }

  /**
   * For a given teamID, returns the rank of the teams in the season from 1 to N (N being the number of teams)
   * @param {string} teamId ID of the team to evaluate
   * @returns {number} Position of the team in the table
   */
  public getTeamRank(teamId: string): number {
    const ranking = this.getRanking();
    const rank = ranking.findIndex((ranking) => ranking.teamId === teamId);
    if (rank === -1) throw new Error(`Team is not ranked [teamId: ${teamId}]`);
    return rank + 1;
  }

  /**
   * Given scores of winner and loser, determine if winner won with offensive bonus
   */
  private _hasWonWithBonus(winnerScore: number, loserScore: number): boolean {
    return winnerScore >= loserScore + 15;
  }

  /**
   * Given scores of winner and loser, determine if loser lost with defensive bonus
   */
  private _hasLoseWithBonus(winnerScore: number, loserScore: number): boolean {
    return winnerScore <= loserScore + 5;
  }

  /**
   * According to the result of a match, take the winner teamRanking and returns it updated with the points attributed for the win
   */
  private _handleWinnerPoints(
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

  /**
   * According to the result of a match, take the loser teamRanking and returns it updated with the points attributed for the lose
   */
  private _handleLoserPoints(
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

  /**
   * For a given teamId, initialize an empty ranking
   */
  private _createEmptyRanking(teamId: string): TeamRanking {
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
}

export const rankingService = new RankingService();
