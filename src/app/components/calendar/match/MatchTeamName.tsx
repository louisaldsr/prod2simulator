export interface MatchTeamNameProps {
  name: string;
}

export default function MatchTeamName(props: MatchTeamNameProps) {
  return <span className="text-sm">{props.name}</span>;
}
