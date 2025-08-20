import { teamRepository } from '@/repositories/team.repository';
import { rankingService } from '@/services/ranking.service';
import RankingTable from './RankingTable';

export default function RankingPanel() {
  const ranking = rankingService.getRanking();
  const teams = teamRepository.getTeams();

  return (
    <section className="bg-white col-span-4 rounded-xl shadow p-6 h-fit">
      <h2>Ranking</h2>
      <RankingTable ranking={ranking} teams={teams} />
    </section>
  );
}
