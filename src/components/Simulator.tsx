import { ScoreProvider } from '@/context/ScoreContext';
import { initializeRepositories } from '@/lib/init-repositories';
import { calendarRepository } from '@/repositories/calendar-repository';
import MatchCalendar from './calendar/MatchCalendar';
import RankingContent from './ranking/RankingContent';

interface SimulatorProps {
  selectedDay: number;
}

export default async function Simulator(props: SimulatorProps) {
  await initializeRepositories();
  const calendar = calendarRepository.getCalendar();

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
      <ScoreProvider>
        <MatchCalendar
          numberOfDays={calendar.length}
          selectedDay={props.selectedDay}
        />
        <RankingContent />
      </ScoreProvider>
    </div>
  );
}
