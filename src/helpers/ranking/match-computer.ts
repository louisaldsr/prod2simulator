import { Match, MatchResult, MatchSide } from "@/types/Match";

export function getMatchResult(match: Match): MatchResult {
  if (match.homeTeamScore === match.awayTeamScore) {
    const score = match.homeTeamScore;
    return {
      winner: "draw",
      winnerTeamId: "",
      winnerScore: score,
      loserScore: score,
      winnerBonus: false,
      loserBonus: false,
    };
  } else {
    const winner: MatchSide =
      match.homeTeamScore > match.awayTeamScore ? "home" : "away";
    const winnerTeamId =
      winner === "home" ? match.homeTeamId : match.awayTeamId;
    const winnerScore =
      winner === "home" ? match.homeTeamScore : match.awayTeamScore;
    const loserScore =
      winner === "home" ? match.awayTeamScore : match.homeTeamScore;
    const winnerBonus = winnerScore >= loserScore + 15;
    const loserBonus = winnerScore <= loserScore + 5;
    return {
      winner,
      winnerTeamId,
      winnerScore,
      loserScore,
      winnerBonus,
      loserBonus,
    };
  }
}
