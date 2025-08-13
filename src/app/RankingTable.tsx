import { rankingService } from '@/lib/ranking-service';
import RankingHeader from './RankingHeader';
import RankingRow from './RankingRow';

export default function RankingTable() {
  const table = rankingService.table;
  const sortedTeamRankings = Array.from(table.values()).sort(
    (a, b) => b.points - a.points
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <RankingHeader />
      {sortedTeamRankings.map((teamRanking, index) => (
        <RankingRow position={index + 1} teamRanking={teamRanking} />
      ))}
    </div>
  );
}
