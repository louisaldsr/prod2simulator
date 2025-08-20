import { RANKING_QUALIFICATION_RULES } from "@/constants";
import { CalendarRepository } from "@/repositories/calendar.repository";
import { Match } from "@/types/Match";
import { TeamRanking } from "@/types/TeamRanking";
import assert from "assert";
import { RankingService } from "./ranking.service";

export class CalendarService {
  public initialized: boolean = false;
  private calendarRepository!: CalendarRepository;
  private rankingService!: RankingService;

  /**
   * Initialize calendar service
   * @param calendarRepository
   * @param rankingService
   */
  public initialize(
    calendarRepository: CalendarRepository,
    rankingService: RankingService
  ): void {
    if (this.initialized) return;
    assert(calendarRepository.initialized === true);
    this.calendarRepository = calendarRepository;
    assert(rankingService.initialized === true);
    this.rankingService = rankingService;
    this.initialized = true;
  }

  /**
   * Updates a match for a given ID with the new score
   * @param {string} matchId ID of the match to update
   * @param {[[number | null, number | null]]} newScore Tuple of two numbers, first item is home score, other is away score. If score is null, then leaves it to current score
   * @returns {Match} Updated match with new score
   */
  public updateMatchScore(
    matchId: string,
    newScore: [number | null, number | null]
  ): Match {
    const updatedMatch = this.calendarRepository.updateMatchScore(
      matchId,
      newScore
    );

    /* If match from regular season, reinitialize finals with new ranking */
    const updatedRanking = this.rankingService.getRanking();
    const matchResult = this.rankingService.getMatchResult(updatedMatch);
    const winnerId =
      matchResult.winner === "home"
        ? updatedMatch.homeTeamId
        : matchResult.winner === "away"
        ? updatedMatch.awayTeamId
        : "";
    const homeTeamRank = this.rankingService.getTeamRank(
      updatedMatch.homeTeamId
    );
    if (updatedMatch.regularSeason) {
      this._reInitializeFinals(updatedRanking);
    } else if (updatedMatch.dayNumber === this._getPlayOffDay()) {
      const semiFinalsDay = this.calendarRepository.getCalendarDay(
        this._getSemiFinalDay()
      );
      const semiFinalMatch =
        homeTeamRank === 3 ? semiFinalsDay[0] : semiFinalsDay[1];
      this.calendarRepository.updateMatchTeams(
        semiFinalMatch.id,
        null,
        winnerId
      );
      const finalMatch = this.calendarRepository.getCalendarDay(
        this._getFinalDay()
      )[0];
      if (homeTeamRank === 3) {
        this.calendarRepository.updateMatchTeams(finalMatch.id, "", null);
      } else {
        this.calendarRepository.updateMatchTeams(finalMatch.id, null, "");
      }
    } else if (updatedMatch.dayNumber === this._getSemiFinalDay()) {
      const finalMatch = this.calendarRepository.getCalendarDay(
        this._getFinalDay()
      )[0];
      if (homeTeamRank === 1) {
        this.calendarRepository.updateMatchTeams(finalMatch.id, winnerId, null);
      } else {
        this.calendarRepository.updateMatchTeams(finalMatch.id, null, winnerId);
      }
    }

    return updatedMatch;
  }

  /**
   * Re initialize the finals day of the calendar according to the current ranking
   * @param {TeamRanking[]} ranking Ranking from which are determined the qualified teams
   */
  private _reInitializeFinals(ranking: TeamRanking[]): void {
    /* PLAY OFFS */
    const playOffsPositions = RANKING_QUALIFICATION_RULES.PLAY_OFFS;
    const playOffTeams = playOffsPositions.map(
      (rank) => ranking[rank - 1].teamId
    );
    const playOffDay = this.calendarRepository.getCalendarDay(
      this._getPlayOffDay()
    );
    this.calendarRepository.updateMatchTeams(
      playOffDay[0].id,
      playOffTeams[0],
      playOffTeams[3]
    );
    this.calendarRepository.updateMatchTeams(
      playOffDay[1].id,
      playOffTeams[1],
      playOffTeams[2]
    );

    /* SEMI FINALS */
    const semiPositions = RANKING_QUALIFICATION_RULES.SEMI_FINALS;
    const semiTeams = semiPositions.map((rank) => ranking[rank - 1].teamId);
    const semiDay = this.calendarRepository.getCalendarDay(
      this._getSemiFinalDay()
    );
    this.calendarRepository.updateMatchTeams(semiDay[0].id, semiTeams[0], "");
    this.calendarRepository.updateMatchTeams(semiDay[1].id, semiTeams[1], "");

    /* FINAL */
    const finalDay = this.calendarRepository.getCalendarDay(
      this._getFinalDay()
    );
    this.calendarRepository.updateMatchTeams(finalDay[0].id, "", "");
  }

  private _getPlayOffDay(): number {
    return this.calendarRepository.regularSeasonDays + 1;
  }

  private _getSemiFinalDay(): number {
    return this.calendarRepository.regularSeasonDays + 2;
  }

  private _getFinalDay(): number {
    return this.calendarRepository.regularSeasonDays + 3;
  }
}

export const calendarService = new CalendarService();
