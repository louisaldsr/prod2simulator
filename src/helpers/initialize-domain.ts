import { calendarRepository } from "@/repositories/calendar.repository";
import { teamRepository } from "@/repositories/team.repository";
import { calendarService } from "@/services/calendar.service";
import { rankingService } from "@/services/ranking.service";

export async function initializeDomain() {
  await teamRepository.initialize();
  await calendarRepository.initialize(teamRepository);
  rankingService.initialize(teamRepository, calendarRepository);
  calendarService.initialize(calendarRepository, rankingService);
}
