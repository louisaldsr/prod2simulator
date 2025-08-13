'use client';

import { changeTeamMatchScore } from '@/app/actions/change-team-match-score';
import { useScoreUpdate } from '@/context/ScoreContext';
import { Match } from '@/types/Match';
import { useState } from 'react';

export interface TeamMatchScoreProps {
  match: Match;
  position: 'home' | 'away';
  teamId: string;
}

export default function TeamMatchScore(props: TeamMatchScoreProps) {
  const { notify } = useScoreUpdate();
  const teamScore =
    props.position === 'home'
      ? props.match.homeTeamScore
      : props.match.awayTeamScore;
  const [score, setScore] = useState<number>(teamScore);
  const [inputValue, setInputValue] = useState<string>(teamScore.toString());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setInputValue(input);
    const parsedValue = parseInt(input, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setScore(parsedValue);
      changeTeamMatchScore(props.match.id, props.teamId, parsedValue);
      notify();
    } else {
      setInputValue(score.toString());
    }
  };

  const handleBlur = () => {
    const trimmed = inputValue.trim();
    const newScore = trimmed === '' ? 0 : parseInt(trimmed, 10);

    if (!isNaN(newScore) && newScore !== score) {
      setScore(newScore);
      changeTeamMatchScore(props.match.id, props.teamId, newScore);
      notify();
    }

    setInputValue(newScore.toString());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBlur();
      event.currentTarget.blur();
    }
  };

  return (
    <input
      type="number"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`w-16 text-center appearance-none focus:outline-none focus:border-none focus:ring-0`}
    />
  );
}
