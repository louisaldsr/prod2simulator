'use client';

import { getFreshCalendar } from '@/app/actions/get-fresh-calendar';
import {
  RANKING_QUALIFICATION_RULES,
  RANKING_RELEGATION_RULES,
} from '@/constants';
import { useScoreUpdate } from '@/context/ScoreContext';
import { computeRanking } from '@/lib/ranking-computer';
import { rankingSort } from '@/lib/ranking-sort';
import { Calendar } from '@/types/Calendar';
import { useEffect, useState } from 'react';
import RankingHeader from './RankingHeader';
import RankingRow from './RankingRow';

type Team = { id: string; logoUrl: string; name: string };
interface RankingTableProps {
  teams: Array<Team>;
  calendar: Calendar;
}

export default function RankingTable(props: RankingTableProps) {
  const { updated } = useScoreUpdate();
  const { calendar, teams } = props;
  const [ranking, setRanking] = useState(() => {
    const ranking = computeRanking(calendar);
    return rankingSort(ranking, teams);
  });
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
    const team = teams.find((team) => team.id === id);
    if (!team) {
      throw new Error(`Team with id ${id} not found`);
    }
    return team;
  };

  useEffect(() => {
    const updateRanking = async () => {
      const freshCalendar = await getFreshCalendar();
      const freshRanking = computeRanking(freshCalendar);
      setRanking(rankingSort(freshRanking, teams));
    };
    updateRanking();
  }, [updated, teams]);

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
