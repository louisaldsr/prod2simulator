import { teamRepository } from '@/repositories/team-repository';
import { Match } from '@/types/Match';
import TeamMatchLogo from './TeamMatchLogo';
import TeamMatchName from './TeamMatchName';
import TeamMatchScore from './TeamMatchScore';

export interface TeamMatchDisplayProps {
  match: Match;
  position: 'home' | 'away';
}

export default function TeamMatchDisplay(props: TeamMatchDisplayProps) {
  const { match, position } = props;
  const teamId = position === 'home' ? match.homeTeamId : match.awayTeamId;
  const team = teamRepository.getTeamById(teamId);
  const { name, logoUrl } = team;

  const isLeft = position === 'home';

  const infoBlock = (
    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
      {isLeft ? (
        <>
          <TeamMatchLogo logoUrl={logoUrl} name={name} />
          <TeamMatchName name={name} />
        </>
      ) : (
        <>
          <TeamMatchName name={name} />
          <TeamMatchLogo logoUrl={logoUrl} name={name} />
        </>
      )}
    </div>
  );
  const scoreBlock = (
    <div className="shrink-0">
      <TeamMatchScore position={position} match={match} teamId={teamId} />
    </div>
  );

  return (
    <div className={`flex items-center justify-between w-full`}>
      {isLeft ? (
        <>
          {infoBlock}
          {scoreBlock}
        </>
      ) : (
        <>
          {scoreBlock}
          {infoBlock}
        </>
      )}
    </div>
  );
}
