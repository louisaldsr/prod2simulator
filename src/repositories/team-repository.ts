import { sanitizeTeamName } from '@/lib/sanitizers';
import { Team } from '@/types/Team';
import { promises as fs } from 'fs';
import path from 'path';

export class TeamRepository {
  public initialized = false;

  constructor(private readonly teams: Team[] = []) {}

  public async loadDatabase(): Promise<void> {
    const csvPath = path.join(process.cwd(), 'src', 'data', 'teams.csv');
    try {
      const rawData = await fs.readFile(csvPath, 'utf-8');
      const teamsData = rawData.split('\n');
      teamsData.shift();
      teamsData.forEach((rawTeamData) => {
        const teamData = rawTeamData.split(',');
        const id = teamData[0];
        const name = teamData[1];
        const logoUrl = `/team-logos/${sanitizeTeamName(name)}.svg`;
        const team: Team = {
          id,
          name,
          logoUrl,
        };
        this.teams.push(team);
      });
      this.initialized = true;
    } catch (error) {
      throw new Error(`Error while loading Teams: ${error}`);
    }
  }

  public getTeams(): Team[] {
    return this.teams;
  }

  public getTeamById(id: string): Team {
    const team = this.teams.find((team) => id === team.id);
    if (!team) {
      throw new Error(`Team with id ${id} not found`);
    }
    return team;
  }
}

export const teamRepository = new TeamRepository();
