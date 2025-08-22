"use client";
import { useGameStore } from "@/app/context/GameStore";
import { Match, MatchSide } from "@/types/Match";
import { Team } from "@/types/Team";
import MatchTeamLogo from "./MatchTeamLogo";
import MatchTeamName from "./MatchTeamName";

interface MatchTeamDisplayProps {
  match: Match;
  side: MatchSide;
}

export default function MatchTeamDisplay(props: MatchTeamDisplayProps) {
  const { match, side } = props;
  const teamId = side === "home" ? match.homeTeamId : match.awayTeamId;
  const getTeam = useGameStore((store) => store.getTeam);

  let team: Team;
  try {
    team = getTeam(teamId);
  } catch (error) {
    if (match.regularSeason) throw error;
    team = {
      id: `${side}NotYetDetermined`,
      name: "To Be Determined",
      logoUrl: "/team-logos/tobedetermined.svg",
    };
  }

  if (side === "home") {
    return (
      <div key={team.id} className="flex items-center gap-3 min-w-0">
        <MatchTeamLogo name={team.name} logoUrl={team.logoUrl} />
        <MatchTeamName name={team.name} />
      </div>
    );
  } else {
    return (
      <div
        key={team.id}
        className="flex items-center gap-3 justify-end min-w-0"
      >
        <MatchTeamName name={team.name} />
        <MatchTeamLogo name={team.name} logoUrl={team.logoUrl} />
      </div>
    );
  }
}
