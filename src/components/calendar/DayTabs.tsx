'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export interface DayTabsProps {
  numberOfDays: number;
  regularSeasonDays: number;
}

export default function DayTabs(props: DayTabsProps) {
  const searchParams = useSearchParams();
  const selectedDay = Number(searchParams.get('day')) ?? 1;
  const { numberOfDays, regularSeasonDays } = props;

  const getTabString = (day: number): string => {
    if (day <= regularSeasonDays) return `D${day}`;
    if (numberOfDays - day === 2) return 'PlayOff';
    if (numberOfDays - day === 1) return 'SF';
    if (numberOfDays - day === 0) return 'F';
    throw new Error(
      `Day out of calendar [Supposed Number of Day: ${numberOfDays}][Days: ${day}]`
    );
  };

  return (
    <div className="flex gap-2 overflow-x-auto border-b pb-2">
      {[...Array(numberOfDays)].map((_, i) => {
        const day = i + 1;
        const isSelected = selectedDay === day;
        return (
          <Link
            key={day}
            href={`?day=${day}`}
            replace
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {getTabString(day)}
          </Link>
        );
      })}
    </div>
  );
}
