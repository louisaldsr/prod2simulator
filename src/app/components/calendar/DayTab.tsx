import Link from 'next/link';

export interface DayTabsProps {
  day: number;
  tabDayString: string;
  isSelected: boolean;
}

export function DayTab(props: DayTabsProps) {
  return (
    <Link
      href={`?day=${props.day}`}
      replace
      className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
        props.isSelected
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      {props.tabDayString}
    </Link>
  );
}
