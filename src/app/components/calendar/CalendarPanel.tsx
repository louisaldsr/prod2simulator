import DayMatchs from "./DayMatchs";
import DayTabs from "./DayTabs";

export interface CalendarPanelProps {
  selectedDay: number;
}

export default function CalendarPanel(props: CalendarPanelProps) {
  return (
    <section className="bg-white col-span-6 rounded-xl shadow p-6 h-fit">
      <h2>Match Calendar</h2>
      <DayTabs />
      <DayMatchs selectedDay={props.selectedDay} />
    </section>
  );
}
