import { sanitizeId } from '@/lib/sanitizers';
import { Calendar } from '@/types/Calendar';
import { Match } from '@/types/Match';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { teamRepository } from './team-repository';

export class CalendarRepository {
  public initialized = false;

  constructor(private readonly calendar: Calendar = []) {}

  public async loadDatabase(): Promise<void> {
    const csvPath = path.join(process.cwd(), 'src', 'data', 'calendar.csv');
    try {
      const rawData = await fs.readFile(csvPath, 'utf-8');
      const calendarData = rawData.split('\n');

      const numberOfTeams = teamRepository.getTeams().length;
      const estimatedDaysNumber = (numberOfTeams - 1) * 2;
      for (let index = 0; index < estimatedDaysNumber; index++) {
        this.calendar.push([]);
      }

      calendarData.forEach((rawMatchData) => {
        const matchData = rawMatchData.split(',');
        const rawDay = Number(matchData[0]);
        const homeTeamId = sanitizeId(matchData[1]);
        const awayTeamId = sanitizeId(matchData[2]);
        const match: Match = {
          id: v4(),
          homeTeamId,
          homeTeamScore: 0,
          awayTeamId,
          awayTeamScore: 0,
          simulated: false,
        };
        this.calendar[rawDay - 1].push(match);
      });
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
    return foundMatch;
  }
}

export const calendarRepository = new CalendarRepository();
