"use client";

import { useGameStore } from "@/app/context/GameStore";
import { Match } from "@/types/Match";
import { useState } from "react";
import ScoreDisplay from "./ScoreInput";

export interface MatchScoreProps {
  match: Match;
}

export default function MatchScore(props: MatchScoreProps) {
  const { match } = props;
  const matchId = match.id;
  const isSimulatable = match.homeTeamId === "" || match.awayTeamId === "";
  const [inputHomeScore, setInputHomeScore] = useState<string>(
    match.homeTeamScore.toString()
  );
  const [inputAwayScore, setInputAwayScore] = useState<string>(
    match.awayTeamScore.toString()
  );

  const changeMatchScore = useGameStore((store) => store.updateMatchScore);

  return (
    <div className="inline-flex items-center gap-2 tabular-nums font-semibold">
      <ScoreDisplay
        inputScore={inputHomeScore}
        setInputScore={setInputHomeScore}
        changeScoreAction={(newScore: number) =>
          changeMatchScore({ matchId, homeScore: newScore, awayScore: null })
        }
        isSimulatable={isSimulatable}
      />
      <div className="text-center font-bold">-</div>
      <ScoreDisplay
        inputScore={inputAwayScore}
        setInputScore={setInputAwayScore}
        changeScoreAction={(newScore: number) =>
          changeMatchScore({ matchId, homeScore: null, awayScore: newScore })
        }
        isSimulatable={isSimulatable}
      />
    </div>
  );
}
