"use client";

import { useGameStore } from "@/app/context/GameStore";
import { useScoreUpdate } from "@/app/context/ScoreContext";
import {
  RANKING_QUALIFICATION_RULES,
  RANKING_RELEGATION_RULES,
} from "@/constants";
import { TeamRanking } from "@/types/TeamRanking";
import { useEffect, useState } from "react";
import RankingHeader from "./RankingHeader";
import RankingRow from "./RankingRow";

export default function RankingTable() {
  const { updated } = useScoreUpdate();
  const { getTeam, getRanking } = useGameStore();
  const [ranking, setRanking] = useState<TeamRanking[]>(getRanking());
  const numberOfTeams = ranking.length;

  const getBackgroundColor = (position: number): string | undefined => {
    if (RANKING_QUALIFICATION_RULES.SEMI_FINALS.includes(position)) {
      return "bg-green-200";
    }
    if (RANKING_QUALIFICATION_RULES.PLAY_OFFS.includes(position)) {
      return "bg-green-100";
    }
    if (
      RANKING_RELEGATION_RULES.RELEGATION.includes(numberOfTeams - position + 1)
    ) {
      return "bg-red-200";
    }
    if (
      RANKING_RELEGATION_RULES.PLAY_OFFS.includes(numberOfTeams - position + 1)
    ) {
      return "bg-red-100";
    }
  };

  useEffect(() => {
    const updateRanking = async () => {
      const newRanking = getRanking();
      setRanking(newRanking);
    };
    updateRanking();
  }, [updated]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <RankingHeader />
        <tbody>
          {Array.from(ranking).map((teamRanking, index) => {
            const team = getTeam(teamRanking.teamId);
            return (
              <RankingRow
                key={index}
                position={index + 1}
                teamRanking={teamRanking}
                teamLogoUrl={team.logoUrl}
                teamName={team.name}
                backgroundColor={getBackgroundColor(index + 1)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
