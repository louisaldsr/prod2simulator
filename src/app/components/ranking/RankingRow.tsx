import { TeamRanking } from '@/types/TeamRanking';
import Image from 'next/image';

export interface RankingRowProps {
  teamRanking: TeamRanking;
  teamName: string;
  teamLogoUrl: string;
  position: number;
  backgroundColor?: string;
}

export default function RankingRow(props: RankingRowProps) {
  const { position, teamName, teamLogoUrl, teamRanking } = props;
  const categoryClassName = 'px-2 py-2';
  const teamScoreDiff =
    teamRanking.totalScore.for - teamRanking.totalScore.against;
  const diffScoreColor =
    teamScoreDiff > 0
      ? 'text-green-600'
      : teamScoreDiff < 0
      ? 'text-red-600'
      : '';

  return (
    <tr className={`text-sm border-b border-gray-100 ${props.backgroundColor}`}>
      <td className={`${categoryClassName} font-bold`}>{position}.</td>
      <td className={categoryClassName}>
        <div className="w-8 aspect-square overflow-hidden shrink-0">
          <Image
            src={teamLogoUrl}
            alt={`${teamName} logo`}
            width={500}
            height={500}
            className="w-full h-full object-contain"
          />
        </div>
      </td>
      <td className={categoryClassName}>{teamName}</td>
      <td className={categoryClassName}>
        {teamRanking.totalMatches.wins +
          teamRanking.totalMatches.draws +
          teamRanking.totalMatches.losses}
      </td>
      <td className={categoryClassName}>{teamRanking.totalMatches.wins}</td>
      <td className={categoryClassName}>{teamRanking.totalMatches.draws}</td>
      <td className={categoryClassName}>{teamRanking.totalMatches.losses}</td>
      <td className={categoryClassName}>{teamRanking.totalScore.for}</td>
      <td className={categoryClassName}>{teamRanking.totalScore.against}</td>
      <td className={`${categoryClassName} ${diffScoreColor}`}>
        {teamRanking.totalScore.for - teamRanking.totalScore.against}
      </td>
      <td className={`${categoryClassName} font-bold`}>{teamRanking.points}</td>
    </tr>
  );
}
