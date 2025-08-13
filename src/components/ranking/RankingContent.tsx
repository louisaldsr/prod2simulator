import { calendarRepository } from '@/repositories/calendar-repository';
import { teamRepository } from '@/repositories/team-repository';
import { Team } from '@/types/Team';
import RankingTable from './RankingTable';

export default function RankingContent() {
  const teams = teamRepository.getTeams();
  const calendar = calendarRepository.getCalendar();

  const toPlainTeams = (
    teams: Team[]
  ): Array<{ id: string; logoUrl: string; name: string }> => {
    return teams.map((team) => ({
      id: team.id,
      logoUrl: team.logoUrl,
      name: team.name,
    }));
  };

  return (
    <section className="bg-white col-span-4 rounded-xl shadow p-6 h-fit">
      <h2>Ranking</h2>
      <RankingTable teams={toPlainTeams(teams)} calendar={calendar} />
    </section>
  );
}
