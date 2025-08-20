import { ScoreProvider } from '@/app/context/ScoreContext';
import { initializeDomain } from '@/helpers/initialize-domain';
import CalendarPanel from './calendar/CalendarPanel';
import RankingPanel from './ranking/RankingPanel';

export interface SimulatorProps {
  selectedDay: number;
}

export default async function Simulator(props: SimulatorProps) {
  await initializeDomain();
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
      <ScoreProvider>
        <CalendarPanel selectedDay={props.selectedDay} />
        <RankingPanel />
      </ScoreProvider>
    </div>
  );
}
