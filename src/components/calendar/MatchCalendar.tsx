import DayMatchs from './DayMatchs';
import DayTabs from './DayTabs';

export interface MatchCalendarProps {
  numberOfDays: number;
  selectedDay: number;
}

export default function MatchCalendar(props: MatchCalendarProps) {
  return (
    <section className="bg-white col-span-6 rounded-xl shadow p-6 h-fit">
      <h2>Match Calendar</h2>
      <DayTabs numberOfDays={props.numberOfDays} />
      <DayMatchs selectedDay={props.selectedDay} />
    </section>
  );
}
