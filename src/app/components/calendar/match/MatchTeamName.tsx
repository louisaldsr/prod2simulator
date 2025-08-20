export interface MatchTeamNameProps {
  name: string;
}

export default function MatchTeamName(props: MatchTeamNameProps) {
  return (
    <span className="text-sm font-medium whitespace-nowrap">{props.name}</span>
  );
}
