'use server';

import { calendarRepository } from '@/repositories/calendar-repository';

export async function getFreshCalendar() {
  return calendarRepository.getCalendar();
}
