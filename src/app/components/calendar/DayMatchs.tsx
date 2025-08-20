import { calendarRepository } from "@/repositories/calendar.repository";
import { Day } from "@/types/Calendar";
import MatchRow from "./match/MatchRow";

export interface DayMatchsProps {
  selectedDay: number;
}

export default async function DayMatchs(props: DayMatchsProps) {
  let dayMatchs: Day;
  try {
    dayMatchs = calendarRepository.getCalendarDay(props.selectedDay);
  } catch {
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
