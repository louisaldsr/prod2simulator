import { calendarRepository } from '@/repositories/calendar.repository';
import DayMatchs from './DayMatchs';
import DayTabs from './DayTabs';

export interface CalendarPanelProps {
  selectedDay: number;
}

export default function CalendarPanel(props: CalendarPanelProps) {
  const calendar = calendarRepository.getCalendar();
  const regularSeasonDays = calendarRepository.regularSeasonDays;
  const finalsDays = calendarRepository.finalsSeasonDays;

  return (
    <section className="bg-white col-span-6 rounded-xl shadow p-6 h-fit">
      <h2>Match Calendar</h2>
      <DayTabs
        numberOfDays={calendar.length}
        regularSeasonDays={regularSeasonDays}
        finalsDays={finalsDays}
      />
      <DayMatchs selectedDay={props.selectedDay} />
    </section>
  );
}
