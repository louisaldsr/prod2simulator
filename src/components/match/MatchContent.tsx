import { Match } from '@/types/Match';
import TeamMatchDisplay from './TeamMatchDisplay';

export interface MatchContentProps {
  match: Match;
}

export default function MatchContent(props: MatchContentProps) {
  const { match } = props;

  return (
    <div className="flex items-center justify-center gap-2 bg-gray-100 px-4 py-6 rounded w-full">
      <div className="flex w-1/2 justify-between items-center">
        <TeamMatchDisplay
          key={match.homeTeamId}
          match={match}
          position={'home'}
        />
      </div>
      <div className="text-center font-bold">-</div>
      <div className="flex w-1/2 justify-between items-center">
        <TeamMatchDisplay
          key={match.awayTeamId}
          match={match}
          position={'away'}
        />
      </div>
    </div>
  );
}
