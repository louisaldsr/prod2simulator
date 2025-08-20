'use client';

import { normalizeFinalDay } from '@/helpers/normalize';
import { useSearchParams } from 'next/navigation';
import { DayTab } from './DayTab';

export interface DayTabsProps {
  numberOfDays: number;
  regularSeasonDays: number;
  finalsDays: string[];
}

export default function DayTabs(props: DayTabsProps) {
  const searchParams = useSearchParams();
  const urlSelectedDay = searchParams.get('day');
  const selectedDay = urlSelectedDay ? Number(urlSelectedDay) : 1;
  const { numberOfDays, regularSeasonDays, finalsDays } = props;

  if (numberOfDays !== regularSeasonDays + finalsDays.length) {
    throw new Error('INVALID CALENDAR');
  }

  const getTabString = (day: number): string => {
    if (regularSeasonDays - day >= 0) return `D${day}`;
    else if (day - regularSeasonDays <= finalsDays.length) {
      return normalizeFinalDay(finalsDays[day - regularSeasonDays - 1]);
    } else {
      throw new Error(
        `Day out of calendar [Supposed Number of Day: ${numberOfDays}][Day: ${day}]`
      );
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto border-b pb-2">
      {[...Array(numberOfDays)].map((_, i) => {
        const day = i + 1;
        const isSelected = selectedDay === day;
        return (
          <DayTab
            key={day}
            day={day}
            isSelected={isSelected}
            tabDayString={getTabString(day)}
          />
        );
      })}
    </div>
  );
}
