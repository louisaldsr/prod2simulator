"use client";

import { useGameStore } from "@/app/context/GameStore";
import { normalizeFinalDay } from "@/helpers/sanitizers";
import { useSearchParams } from "next/navigation";
import { DayTab } from "./DayTab";

export default function DayTabs() {
  const searchParams = useSearchParams();
  const urlSelectedDay = searchParams.get("day");
  const selectedDay = urlSelectedDay ? Number(urlSelectedDay) : 1;

  const calendar = useGameStore((store) => store.calendar);
  const numberOfDays = calendar.length;
  const regularSeasonDays = useGameStore((store) =>
    store.getRegularSeasonLength()
  );

  const getTabString = (day: number): string => {
    if (day <= regularSeasonDays) return `D${day}`;
    else if (day <= numberOfDays) {
      return normalizeFinalDay(day - regularSeasonDays);
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
