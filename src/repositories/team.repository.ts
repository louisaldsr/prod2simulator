import { TeamNotFoundError } from "@/errors/TeamNotFound.error";
import { sanitizeTeamName } from "@/helpers/sanitizers";
import { Team } from "@/types/Team";
import { promises as fs } from "fs";
import path from "path";

export class TeamRepository {
  public initialized = false;
  /* Teams playing the season */
  private readonly teams: Team[] = [];

  /**
   * Initialize the team repository to ensure the DB and the data required for the app is ready
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;
    let loadedTeams: Team[];
    try {
      loadedTeams = await this._loadTeamsFromDB();
    } catch (error) {
      throw new Error(`Error while loading Teams from DB: ${error}`);
    }
    this.teams.push(...loadedTeams);

    this.initialized = true;
  }

  /**
   * Load from CSV database the list of teams
   * @returns {Promise<Team[]>}
   */
  private async _loadTeamsFromDB(): Promise<Team[]> {
    const teams: Team[] = [];

    const csvPath = path.join(process.cwd(), "src", "data", "teams.csv");
    const rawData = await fs.readFile(csvPath, "utf-8");
    const teamsData = rawData.split("\n");
    teamsData.forEach((rawTeamData) => {
      const teamData = rawTeamData.split(",");
      const id = teamData[0];
      const name = teamData[1];
      this.teams.push(this._createTeam(id, name));
    });

    return teams;
  }

  /**
   * Get the list of teams for the season
   * @returns {Team[]}
   */
  public getTeams(): Team[] {
    return this.teams;
  }

  /**
   * For a given teamID, returns the found team
   * @param {string} teamId ID of the team to fetch
   * @returns {Team}
   */
  public getTeamById(teamId: string): Team {
    const team = this.teams.find((team) => teamId === team.id);
    if (!team) {
      throw new TeamNotFoundError({ id: teamId });
    }
    return team;
  }

  /**
   * From a given id and name, create the corresponding team
   * @param {string} id Id of the team
   * @param {string} name Name of the team
   * @returns {Team} Returns the created team
   */
  private _createTeam(id: string, name: string): Team {
    const logoUrl = `/team-logos/${sanitizeTeamName(name)}.svg`;
    return {
      id,
      name,
      logoUrl,
    };
  }
}

export const teamRepository = new TeamRepository();
