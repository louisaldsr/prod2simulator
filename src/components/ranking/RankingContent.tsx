import { calendarRepository } from '@/repositories/calendar-repository';
import { teamRepository } from '@/repositories/team-repository';
import RankingTable from './RankingTable';

export default function RankingContent() {
  const teams = teamRepository.getTeams();
  const calendar = calendarRepository.getCalendar();

  return (
    <section className="bg-white col-span-4 rounded-xl shadow p-6 h-fit">
      <h2>Ranking</h2>
      <RankingTable teams={teams} calendar={calendar} />
    </section>
  );
}
