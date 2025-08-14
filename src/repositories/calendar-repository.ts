import { RANKING_QUALIFICATION_RULES } from '@/constants';
import { computeRanking, getMatchResult } from '@/lib/ranking-computer';
import { rankingSort } from '@/lib/ranking-sort';
import { sanitizeId } from '@/lib/sanitizers';
import { Calendar } from '@/types/Calendar';
import { Match } from '@/types/Match';
import { TeamRanking } from '@/types/TeamRanking';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { teamRepository } from './team-repository';

export class CalendarRepository {
  public initialized = false;
  public regularSeasonDays: number = 0;

  constructor(private readonly calendar: Calendar = []) {}

  public async loadDatabase(): Promise<void> {
    const csvPath = path.join(process.cwd(), 'src', 'data', 'calendar.csv');
    try {
      const rawData = await fs.readFile(csvPath, 'utf-8');
      const calendarData = rawData.split('\n');

      const numberOfTeams = teamRepository.getTeams().length;
      this.regularSeasonDays = (numberOfTeams - 1) * 2;
      for (let index = 0; index < this.regularSeasonDays; index++) {
        this.calendar.push([]);
      }

      calendarData.forEach((rawMatchData) => {
        const matchData = rawMatchData.split(',');
        const rawDay = Number(matchData[0]);
        const homeTeamId = sanitizeId(matchData[1]);
        const awayTeamId = sanitizeId(matchData[2]);
        const match = this._createMatch(homeTeamId, awayTeamId, true);
        this.calendar[rawDay - 1].push(match);
      });

      this._assertCalendarValidity();
      this._addFinals();
      this.initialized = true;
    } catch (error) {
      throw new Error(`Error while loading Calendar: ${error}`);
    }
  }

  public getCalendar(): Calendar {
    return this.calendar;
  }

  public getMatchById(matchId: string): Match {
    const allMatches = this.calendar.flat();
    const foundMatch = allMatches.find((match) => match.id === matchId);
    if (!foundMatch) {
      throw new Error(`No Match found with ID: ${matchId}`);
    }
    return foundMatch;
  }

  public updateMatchScore(
    matchId: string,
    teamId: string,
    newScore: number
  ): Match {
    const foundMatch = this.getMatchById(matchId);
    if (foundMatch.homeTeamId === teamId) {
      foundMatch.homeTeamScore = newScore;
    } else if (foundMatch.awayTeamId === teamId) {
      foundMatch.awayTeamScore = newScore;
    } else {
      throw new Error(
        `Team ID ${teamId} does not belong to Match ID ${matchId}`
      );
    }
    foundMatch.simulated = true;

    const matchDay =
      this.calendar.findIndex((day) => {
        day.forEach((match) => {
          return match.id === matchId;
        });
      }) + 1;
    if (matchDay <= this.regularSeasonDays) {
      const newRanking = computeRanking(this.calendar);
      const newSortedRanking = rankingSort(
        newRanking,
        teamRepository.getTeams()
      );
      this.updateFinalsOnRegularChange(newSortedRanking);
    } else if (matchDay === this.regularSeasonDays + 1) {
      const playOffOrder = this.calendar[this.regularSeasonDays].findIndex(
        (playOff) => playOff.id === foundMatch.id
      );
      const semiDay = this.calendar[this.regularSeasonDays + 2];
      const newMatchResult = getMatchResult(
        foundMatch.homeTeamScore,
        foundMatch.awayTeamScore
      );
      if (newMatchResult.winner === 'home') {
        semiDay[playOffOrder] = this._createMatch(
          semiDay[playOffOrder].homeTeamId,
          foundMatch.homeTeamId,
          false
        );
      } else if (newMatchResult.winner === 'away') {
        semiDay[playOffOrder] = this._createMatch(
          semiDay[playOffOrder].homeTeamId,
          foundMatch.awayTeamId,
          false
        );
      }
    } else if (matchDay === this.regularSeasonDays + 2) {
      const semiOrder = this.calendar[this.regularSeasonDays + 1].findIndex(
        (semi) => semi.id === foundMatch.id
      );
      const newMatchResult = getMatchResult(
        foundMatch.homeTeamScore,
        foundMatch.awayTeamScore
      );
      let newFinalist = '';
      if (newMatchResult.winner === 'home') {
        newFinalist = foundMatch.homeTeamId;
      } else if (newMatchResult.winner === 'away') {
        newFinalist = foundMatch.awayTeamId;
      }

      if (semiOrder === 0) {
        this.calendar[this.regularSeasonDays + 3][0] = this._createMatch(
          newFinalist,
          this.calendar[this.regularSeasonDays + 3][0].awayTeamId,
          false
        );
      } else {
        this.calendar[this.regularSeasonDays + 3][0] = this._createMatch(
          this.calendar[this.regularSeasonDays + 3][0].homeTeamId,
          newFinalist,
          false
        );
      }
    }
    return foundMatch;
  }

  public updateFinalsOnRegularChange(ranking: TeamRanking[]): void {
    const playOffTeamIds = RANKING_QUALIFICATION_RULES.PLAY_OFFS.map(
      (position) => {
        return ranking[position - 1].teamId;
      }
    );
    const numberTeamsPlayOffs = playOffTeamIds.length;
    if (numberTeamsPlayOffs % 2 !== 0)
      throw new Error(
        `Calendar Misformat: odd number of teams for Play Offs [number: ${playOffTeamIds.length}]`
      );
    const playOffDay = this.regularSeasonDays + 1;
    this.calendar[playOffDay - 1] = [];
    for (let i = 0; i < numberTeamsPlayOffs / 2; i++) {
      this.calendar[playOffDay - 1].push(
        this._createMatch(playOffTeamIds.shift()!, playOffTeamIds.pop()!, false)
      );
    }

    const semiTeamIds = RANKING_QUALIFICATION_RULES.SEMI_FINALS.map(
      (position) => {
        return ranking[position - 1].teamId;
      }
    );
    const semiDay = this.regularSeasonDays + 2;
    this.calendar[semiDay - 1] = [
      this._createMatch(semiTeamIds.shift()!, '', false),
      this._createMatch(semiTeamIds.shift()!, '', false),
    ];
  }

  private _addFinals(): void {
    const initialRanking = computeRanking(this.calendar);
    const sortedRanking = rankingSort(
      initialRanking,
      teamRepository.getTeams()
    );

    this.calendar.push([], [], [this._createMatch('', '', false)]);
    this.updateFinalsOnRegularChange(sortedRanking);
  }

  private _assertCalendarValidity(): void {
    this.calendar.forEach((day, index) => {
      const cacheTeamDay: string[] = [];
      const dayNumber = index + 1;
      day.forEach((match) => {
        const homeId = match.homeTeamId;
        const awayId = match.awayTeamId;
        if (
          cacheTeamDay.includes(homeId) ||
          cacheTeamDay.includes(awayId) ||
          homeId === awayId
        )
          throw new Error(
            `Match invalid [day: ${dayNumber}][homeTeam: ${homeId}][awayTeam: ${awayId}]`
          );
        cacheTeamDay.push(homeId, awayId);
      });
    });
  }

  private _createMatch(
    homeTeamId: string,
    awayTeamId: string,
    regularSeason: boolean
  ): Match {
    return {
      id: v4(),
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
