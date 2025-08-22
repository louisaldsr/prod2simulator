"use client";
import { useGameStore } from "@/app/context/GameStore";
import MatchRow from "./match/MatchRow";

export interface DayMatchsProps {
  selectedDay: number;
}

export default function DayMatchs(props: DayMatchsProps) {
  const calendar = useGameStore((store) => store.calendar);
  const dayMatchs = calendar[props.selectedDay - 1];

  if (!dayMatchs) {
    return <div>No match for this day</div>;
  }

  return (
    <div>
      {dayMatchs.map((match) => {
        return <MatchRow key={match.id} match={match} />;
      })}
    </div>
  );
}
