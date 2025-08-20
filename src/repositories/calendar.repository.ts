import { FINALS_DAY_FORMAT } from "@/constants";
import { MatchNotFoundError } from "@/errors/MatchNotFound.error";
import { sanitizeId } from "@/helpers/sanitizers";
import { Calendar, Day } from "@/types/Calendar";
import { Match } from "@/types/Match";
import { promises as fs } from "fs";
import path from "path";
import { v4 } from "uuid";
import { TeamRepository } from "./team.repository";

export class CalendarRepository {
  public initialized = false;
  /* Number of game days in the calendar for the regular season */
  public regularSeasonDays: number = 0;
  /* Format of the days for final */
  public finalsSeasonDays: string[] = [];
  /* Calendar of the season with each game day (regular or finals) and for each day, all the different matchs  */
  private readonly calendar: Calendar = [];

  /**
   * Initialize the calendar repository to ensure the DB and the data required for the app is ready
   * @param {TeamRepository} teamRepository Dependency for the initialize method to fetch the teams
   */
  public async initialize(teamRepository: TeamRepository): Promise<void> {
    if (this.initialized) return;
    const numberOfTeams = teamRepository.getTeams().length;

    /* Regular Season */
    this.regularSeasonDays = this._getEstimatedRegularDays(numberOfTeams);
    let regularCalendar: Calendar;
    try {
      regularCalendar = await this._loadRegularCalendarFromDB();
    } catch (error) {
      throw new Error(`Error while loading Calendar: ${error}`);
    }
    if (regularCalendar.length !== this.regularSeasonDays) {
      throw new Error(
        `Invalid Calendar data for regular season: [Estimated number of games: ${this.regularSeasonDays}][Loaded Calendar Days: ${regularCalendar.length}]`
      );
    }
    this.calendar.push(...regularCalendar);

    /* Finals Days Season */
    const finalsCalendar = this._createFinalsCalendar();
    this.calendar.push(...finalsCalendar);

    this.initialized = true;
  }

  /**
   * Get the calendar of season
   * @returns {Calendar}
   */
  public getCalendar(): Calendar {
    return this.calendar;
  }

  /**
   * For a given match ID, returns it
   * @param {string} matchId ID of the match to fetch
   * @returns {Match}
   */
  public getMatch(matchId: string): Match {
    const allMatches = this.calendar.flat();
    const foundMatch = allMatches.find((match) => match.id === matchId);
    if (!foundMatch) {
      throw new MatchNotFoundError({ id: matchId });
    }
    return foundMatch;
  }

  /**
   * For a given matchID and new home and away teams, update the existing match teams
   * If teamID is null, then leaves the previous one
   *
   * Operation will reset the score to 0-0
   * @param matchId ID of the match to update
   * @param homeTeamId ID of the team playing home side
   * @param awayTeamId ID of the team playing away side
   */
  public updateMatchTeams(
    matchId: string,
    homeTeamId: string | null,
    awayTeamId: string | null
  ): Match {
    const existingMatch = this.getMatch(matchId);
    if (homeTeamId) existingMatch.homeTeamId = homeTeamId;
    if (awayTeamId) existingMatch.awayTeamId = awayTeamId;
    existingMatch.homeTeamScore = 0;
    existingMatch.awayTeamScore = 0;
    return existingMatch;
  }

  /**
   * For a given game day, returns the list of the matchs scheduled at this date
   * @param {number} day Day number from 1 to X being the maximum number of day
   */
  public getCalendarDay(day: number): Day {
    if (day <= 0 || day > this.calendar.length) {
      throw new Error(
        `Day out of calendar [calendarDays: ${this.calendar.length}][searchedDay: ${day}]`
      );
    }
    return this.calendar.at(day - 1)!;
  }

  /**
   * For a given teamID, returns all the matches of this team in the calendar
   * @param {string} teamId ID of the team for which retrieving all the matchs
   * @returns {Match[]} List of matchs played by the team
   */
  public getTeamMatchs(teamId: string): Match[] {
    return this.calendar.flat().filter((match) => {
      return match.homeTeamId === teamId || match.awayTeamId === teamId;
    });
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
    const foundMatch = this.getMatch(matchId);
    const [newHomeScore, newAwayScore] = newScore;

    if (newHomeScore) foundMatch.homeTeamScore = newHomeScore;
    if (newAwayScore) foundMatch.awayTeamScore = newAwayScore;

    foundMatch.simulated = true;
    return foundMatch;
  }

  /**
   * Get estimated number of day games in the regular season calendar
   */
  private _getEstimatedRegularDays(numberOfTeams: number): number {
    /* Assuming calendar is based on back-and-forth match system */
    return (numberOfTeams - 1) * 2;
  }

  /**
   * Load data for calendar from CSV file and returns the calendar with each day of regular known season
   * @returns {Promise<Calendar>}
   */
  private async _loadRegularCalendarFromDB(): Promise<Calendar> {
    const regularCalendar: Calendar = Array.from(
      { length: this.regularSeasonDays },
      () => []
    );

    const csvPath = path.join(process.cwd(), "src", "data", "calendar.csv");
    const rawData = await fs.readFile(csvPath, "utf-8");
    const calendarData = rawData.split("\n");
    calendarData.forEach((rawMatchData) => {
      /* Raw Match format: day,homeTeamId,awayTeamId */
      const matchData = rawMatchData.split(",");
      const rawDay = Number(matchData[0]);
      const homeTeamId = sanitizeId(matchData[1]);
      const awayTeamId = sanitizeId(matchData[2]);
      const match = this.createMatch(rawDay, homeTeamId, awayTeamId, true);
      regularCalendar[rawDay - 1].push(match);
    });

    return regularCalendar;
  }

  /**
   * Creates Finals calendar games and returns it
   * Assuming the finals follow this format: 3 more days with 2 PlayOffs, 2 SemiFinals, 1 Final
   * @returns {Calendar}
   */
  private _createFinalsCalendar(): Calendar {
    this.finalsSeasonDays = [...FINALS_DAY_FORMAT];

    const finalsCalendar = new Array(this.finalsSeasonDays.length).fill([]);
    finalsCalendar[0] = [
      this.createMatch(this.regularSeasonDays + 1, "", "", false),
      this.createMatch(this.regularSeasonDays + 1, "", "", false),
    ];
    finalsCalendar[1] = [
      this.createMatch(this.regularSeasonDays + 2, "", "", false),
      this.createMatch(this.regularSeasonDays + 2, "", "", false),
    ];
    finalsCalendar[2] = [
      this.createMatch(this.regularSeasonDays + 3, "", "", false),
    ];
    return finalsCalendar;
  }

  /**
   * Creates a match from initial required data
   * @param {string} homeTeamId ID of the home team
   * @param {string} awayTeamId ID of the away team
   * @param {boolean} regularSeason Boolean deciding if given match is for the regular season, if false, then match for finals
   * @returns {Match} Created match
   */
  public createMatch(
    dayNumber: number,
    homeTeamId: string,
    awayTeamId: string,
    regularSeason: boolean
  ): Match {
    return {
      id: v4(),
      dayNumber,
      homeTeamId,
      homeTeamScore: 0,
      awayTeamId,
      awayTeamScore: 0,
      simulated: false,
      regularSeason,
    };
  }
}

export const calendarRepository = new CalendarRepository();
