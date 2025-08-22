import { useScoreUpdate } from "@/app/context/ScoreContext";
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useRef,
} from "react";

interface ScoreDisplayProps {
  inputScore: string;
  setInputScore: Dispatch<SetStateAction<string>>;
  changeScoreAction: (newScore: number) => void;
  isSimulatable: boolean;
}

export default function ScoreDisplay(props: ScoreDisplayProps) {
  const { inputScore, setInputScore, changeScoreAction } = props;
  const { notify } = useScoreUpdate();
  const previousScore = useRef<number | null>(null);

  const parseInput = (input: string): number | null => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return null;
    if (!/^\d+$/.test(trimmedInput)) return null;
    if (["1", "2", "4"].includes(trimmedInput)) return null;
    return Math.min(999, parseInt(trimmedInput, 10));
  };

  const commitNewScore = async () => {
    const parsedInput = parseInput(inputScore) ?? 0;
    if (parsedInput === previousScore.current) return;

    await changeScoreAction(parsedInput);
    previousScore.current = parsedInput;
    notify();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const score = parseInput(event.target.value);
    if (score !== null) setInputScore(score.toString());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      commitNewScore();
      event.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="\\d*"
      min={3}
      value={props.inputScore}
      onChange={handleChange}
      onBlur={commitNewScore}
      onKeyDown={handleKeyDown}
      hidden={props.isSimulatable}
      className={`w-16 text-center tabular-nums appearance-none focus:outline-none focus:border-none focus:ring-0`}
    />
  );
}
