"use client";

import { MatchNotFoundError } from "@/errors/MatchNotFound.error";
import { TeamNotFoundError } from "@/errors/TeamNotFound.error";
import { computeRanking } from "@/helpers/ranking/ranking-computer";
import { Calendar } from "@/types/Calendar";
import { Team } from "@/types/Team";
import { TeamRanking } from "@/types/TeamRanking";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InitializeGameStoreParams {
  calendar: Calendar;
  teams: Team[];
}

export interface UpdateMatchScoreParams {
  matchId: string;
  homeScore: number | null;
  awayScore: number | null;
}

export interface GameStore {
  calendar: Calendar;
  teams: Team[];
  initialize: (params: InitializeGameStoreParams) => void;
  initialized: boolean;
  updateMatchScore: (params: UpdateMatchScoreParams) => void;
  getRegularSeasonLength: () => number;
  getTeam: (id: string) => Team;
  getRanking: () => TeamRanking[];
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      calendar: [],
      teams: [],
      initialized: false,

      initialize: (params: InitializeGameStoreParams) =>
        set({
          ...params,
          initialized: true,
        }),

      updateMatchScore: (params: UpdateMatchScoreParams) => {
        const calendar = get().calendar;
        const match = calendar
          .flat()
          .find((match) => match.id === params.matchId);

        if (!match) throw new MatchNotFoundError({ id: params.matchId });
        if (params.homeScore) match.homeTeamScore = params.homeScore;
        if (params.awayScore) match.awayTeamScore = params.awayScore;
        match.simulated = true;
      },

      getRegularSeasonLength: () => {
        const calendar = get().calendar;
        const firstFinalMatch = calendar
          .flat()
          .find((match) => !match.regularSeason);
        if (firstFinalMatch) return firstFinalMatch.dayNumber - 1;
        return calendar.length;
      },

      getTeam(teamId: string): Team {
        const team = get().teams.find((team) => team.id === teamId);
        if (!team) throw new TeamNotFoundError({ id: teamId });
        return team;
      },

      getRanking(): TeamRanking[] {
        const calendar = get().calendar;
        const teams = get().teams;
        return computeRanking(calendar, teams);
      },
    }),
    {
      name: "prod2simulator",
    }
  )
);
