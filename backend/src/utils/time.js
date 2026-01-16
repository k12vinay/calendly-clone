import { DateTime } from "luxon";

export const buildSlotsForDate = ({
  dateISO,
  timezone,
  dayStart,
  dayEnd,
  durationMinutes,
}) => {
  if (!dayStart || !dayEnd) return [];

  const startParts = dayStart.split(":");
  const endParts = dayEnd.split(":");
  const day = DateTime.fromISO(dateISO, { zone: timezone });

  let cursor = day.set({
    hour: Number.parseInt(startParts[0], 10),
    minute: Number.parseInt(startParts[1], 10),
    second: 0,
    millisecond: 0,
  });
  const end = day.set({
    hour: Number.parseInt(endParts[0], 10),
    minute: Number.parseInt(endParts[1], 10),
    second: 0,
    millisecond: 0,
  });

  const slots = [];
  while (cursor.plus({ minutes: durationMinutes }) <= end) {
    slots.push({
      start: cursor.toISO(),
      end: cursor.plus({ minutes: durationMinutes }).toISO(),
      label: cursor.toFormat("h:mm a"),
    });
    cursor = cursor.plus({ minutes: durationMinutes });
  }

  return slots;
};

export const toDateKey = (dateTimeISO, timezone) =>
  DateTime.fromISO(dateTimeISO, { zone: timezone }).toISODate();
