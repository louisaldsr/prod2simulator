import { calendarRepository } from '@/repositories/calendar-repository';
import MatchContent from '../match/MatchContent';

interface DayMatchsProps {
  selectedDay: number;
}

export default async function DayMatchs(props: DayMatchsProps) {
  const calendar = calendarRepository.getCalendar();
  const selectedDay = props.selectedDay ?? 1;
  const dayMatchs = calendar[selectedDay - 1];

  if (!dayMatchs) {
    return <div>No matches for this day</div>;
  }

  return (
    <div>
      {dayMatchs.map((match) => {
        return <MatchContent key={match.id} match={match} />;
      })}
    </div>
  );
}
