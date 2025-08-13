'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export interface DayTabsProps {
  numberOfDays: number;
}

export default function DayTabs(props: DayTabsProps) {
  const searchParams = useSearchParams();
  const selectedDay = Number(searchParams.get('day')) ?? 1;

  return (
    <div className="flex gap-2 overflow-x-auto border-b pb-2">
      {[...Array(props.numberOfDays)].map((_, i) => {
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
            D{day}
          </Link>
        );
      })}
    </div>
  );
}
