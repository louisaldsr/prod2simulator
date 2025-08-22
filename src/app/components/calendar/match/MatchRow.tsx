import { Match } from "@/types/Match";
import MatchScore from "./MatchScore";
import MatchTeamDisplay from "./MatchTeamDisplay";

export interface MatchRowProps {
  match: Match;
}

export default function MatchRow(props: MatchRowProps) {
  const { match } = props;

  return (
    <div className="grid items-center grid-cols-[1fr_minmax(72px,auto)_1fr] gap-4 py-5 px-4">
      <MatchTeamDisplay key="home" match={match} side="home" />
      <MatchScore match={match} />
      <MatchTeamDisplay key="away" match={match} side="away" />
    </div>
  );
}
