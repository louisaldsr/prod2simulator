'use client';

import { getFreshRanking } from '@/app/actions/get-fresh-ranking';
import { useScoreUpdate } from '@/app/context/ScoreContext';
import {
  RANKING_QUALIFICATION_RULES,
  RANKING_RELEGATION_RULES,
} from '@/constants';
import { Team } from '@/types/Team';
import { TeamRanking } from '@/types/TeamRanking';
import { useEffect, useState } from 'react';
import RankingHeader from './RankingHeader';
import RankingRow from './RankingRow';

interface RankingTableProps {
  ranking: TeamRanking[];
  teams: Team[];
}

export default function RankingTable(props: RankingTableProps) {
  const { updated } = useScoreUpdate();
  const [ranking, setRanking] = useState(props.ranking);
  const numberOfTeams = ranking.length;

  const getBackgroundColor = (position: number): string | undefined => {
    if (RANKING_QUALIFICATION_RULES.SEMI_FINALS.includes(position)) {
      return 'bg-green-200';
    }
    if (RANKING_QUALIFICATION_RULES.PLAY_OFFS.includes(position)) {
      return 'bg-green-100';
    }
    if (
      RANKING_RELEGATION_RULES.RELEGATION.includes(numberOfTeams - position + 1)
    ) {
      return 'bg-red-200';
    }
    if (
      RANKING_RELEGATION_RULES.PLAY_OFFS.includes(numberOfTeams - position + 1)
    ) {
      return 'bg-red-100';
    }
  };

  const getTeam = (id: string): Team => {
    const team = props.teams.find((team) => team.id === id);
    if (!team) throw new Error('Team in ranking not existing');
    return team;
  };

  useEffect(() => {
    const updateRanking = async () => {
      const newRanking = await getFreshRanking();
      setRanking(newRanking);
    };
    updateRanking();
  }, [updated]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <RankingHeader />
        <tbody>
          {Array.from(ranking).map((teamRanking, index) => {
            const team = getTeam(teamRanking.teamId);
            return (
              <RankingRow
                key={index}
                position={index + 1}
                teamRanking={teamRanking}
                teamLogoUrl={team.logoUrl}
                teamName={team.name}
                backgroundColor={getBackgroundColor(index + 1)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
