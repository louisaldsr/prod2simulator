"use client";

import { changeMatchScore } from "@/app/actions/change-team-match-score";
import { Match } from "@/types/Match";
import { useState } from "react";
import ScoreDisplay from "./ScoreInput";

export interface MatchScoreProps {
  match: Match;
}

export default function MatchScore(props: MatchScoreProps) {
  const { match } = props;
  const isSimulatable = match.homeTeamId === "" || match.awayTeamId === "";
  const [inputHomeScore, setInputHomeScore] = useState<string>(
    match.homeTeamScore.toString()
  );
  const [inputAwayScore, setInputAwayScore] = useState<string>(
    match.awayTeamScore.toString()
  );

  return (
    <div className="inline-flex items-center gap-2 tabular-nums font-semibold">
      <ScoreDisplay
        inputScore={inputHomeScore}
        setInputScore={setInputHomeScore}
        changeScoreAction={(newScore: number) =>
          changeMatchScore(match.id, [newScore, null])
        }
        isSimulatable={isSimulatable}
      />
      <div className="text-center font-bold">-</div>
      <ScoreDisplay
        inputScore={inputAwayScore}
        setInputScore={setInputAwayScore}
        changeScoreAction={(newScore: number) =>
          changeMatchScore(match.id, [null, newScore])
        }
        isSimulatable={isSimulatable}
      />
    </div>
  );
}
