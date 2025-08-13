import { TeamRanking } from '@/types/TeamRanking';

export interface RankingRowProps {
  teamRanking: TeamRanking;
  teamName: string;
  teamLogoUrl: string;
  position: number;
  backgroundColor?: string;
}

export default function RankingRow(props: RankingRowProps) {
  const { position, teamName, teamLogoUrl } = props;
  let { teamRanking } = props;
  const categoryClassName = 'px-2 py-3';

  return (
    <tr className={`text-sm border-b border-gray-100 ${props.backgroundColor}`}>
      <td className={categoryClassName}>{position}</td>
      <td className={categoryClassName}>
        <div className="w-8 aspect-square overflow-hidden shrink-0">
          <img
            src={teamLogoUrl}
            alt={`${teamName} logo`}
            className="w-full h-full object-contain"
          />
        </div>
      </td>
      <td className={categoryClassName}>{teamName}</td>
      <td className={categoryClassName}>{teamRanking.totalMatches.wins}</td>
      <td className={categoryClassName}>{teamRanking.totalMatches.draws}</td>
      <td className={categoryClassName}>{teamRanking.totalMatches.losses}</td>
      <td className={categoryClassName}>{teamRanking.totalScore.for}</td>
      <td className={categoryClassName}>{teamRanking.totalScore.against}</td>
      <td className={categoryClassName}>
        {teamRanking.totalScore.for - teamRanking.totalScore.against}
      </td>
      <td className={categoryClassName}>{teamRanking.points}</td>
    </tr>
  );
}
