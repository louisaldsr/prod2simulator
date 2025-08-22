"use server";
import { sanitizeId, sanitizeTeamName } from "@/helpers/sanitizers";
import { Calendar } from "@/types/Calendar";
import { Match } from "@/types/Match";
import { Team } from "@/types/Team";
import { promises as fs } from "fs";

import path from "path";
import { v4 } from "uuid";
import { InitializeGameStoreParams } from "../context/GameStore";

async function readCsv(fileName: string): Promise<string[]> {
  const csvPath = path.join(process.cwd(), "public", "data", fileName);
  const rawFileContent = await fs.readFile(csvPath, "utf-8");
  return rawFileContent.split("\n");
}

export async function loadGameStoreParams(): Promise<InitializeGameStoreParams> {
  const rawTeams = await readCsv("teams.csv");
  const teams = rawTeams.map((rawTeam) => {
    const teamData = rawTeam.split(",");
    const id = teamData[0];
    const name = teamData[1];
    return createTeam(id, name);
  });

  const regularSeasonDays = (teams.length - 1) * 2;
  const calendar: Calendar = Array.from(
    { length: regularSeasonDays },
    () => []
  );
  const rawCalendar = await readCsv("calendar.csv");
  rawCalendar.forEach((rawMatch) => {
    const matchData = rawMatch.split(",");
    const rawDay = Number(matchData[0]);
    const homeTeamId = sanitizeId(matchData[1]);
    const awayTeamId = sanitizeId(matchData[2]);
    const match = createMatch(rawDay, homeTeamId, awayTeamId, true);
    calendar[rawDay - 1].push(match);
  });

  const finalsCalendar = createFinalsCalendar(calendar.length);
  const completeCalendar = calendar.concat(finalsCalendar);

  return {
    calendar: completeCalendar,
    teams,
  };
}

function createTeam(id: string, name: string): Team {
  const logoUrl = `/team-logos/${sanitizeTeamName(name)}.svg`;
  return {
    id,
    name,
    logoUrl,
  };
}

function createMatch(
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

function createFinalsCalendar(regularSeasonDays: number): Calendar {
  return [
    [
      createMatch(regularSeasonDays + 1, "", "", false),
      createMatch(regularSeasonDays + 1, "", "", false),
    ], // PLAY OFFS
    [
      createMatch(regularSeasonDays + 2, "", "", false),
      createMatch(regularSeasonDays + 2, "", "", false),
    ], // SEMI
    [createMatch(regularSeasonDays + 3, "", "", false)], // FINAL
  ];
}
