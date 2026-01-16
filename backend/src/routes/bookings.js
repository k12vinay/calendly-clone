import express from "express";
import { DateTime } from "luxon";
import { query } from "../db.js";
import { buildSlotsForDate } from "../utils/time.js";

const router = express.Router();

const getEventType = async ({ eventTypeId, slug }) => {
  if (eventTypeId) {
    const result = await query(
      "SELECT id, name, duration_min, slug FROM event_types WHERE id = $1",
      [eventTypeId]
    );
    return result.rows[0];
  }
  if (slug) {
    const result = await query(
      "SELECT id, name, duration_min, slug FROM event_types WHERE slug = $1",
      [slug]
    );
    return result.rows[0];
  }
  return null;
};

const getAvailabilityForDate = async ({ userId, dateISO }) => {
  const availabilityResult = await query(
    "SELECT id, timezone FROM availability WHERE user_id = $1 LIMIT 1",
    [userId]
  );
  const availability = availabilityResult.rows[0];
  if (!availability) return null;

  const overrideResult = await query(
    "SELECT date, start_time, end_time, is_unavailable FROM availability_overrides WHERE availability_id = $1 AND date = $2",
    [availability.id, dateISO]
  );
  const override = overrideResult.rows[0];
  if (override?.is_unavailable) {
    return { ...availability, day: null };
  }

  const dayOfWeek = DateTime.fromISO(dateISO, {
    zone: availability.timezone,
  }).weekday % 7;
  const dayResult = await query(
    "SELECT day_of_week, start_time, end_time FROM availability_days WHERE availability_id = $1 AND day_of_week = $2",
    [availability.id, dayOfWeek]
  );

  const day = override
    ? {
        day_of_week: dayOfWeek,
        start_time: override.start_time,
        end_time: override.end_time,
      }
    : dayResult.rows[0];

  return { ...availability, day };
};

router.get("/slots", async (req, res) => {
  const { date, eventTypeId, slug } = req.query;
  const eventType = await getEventType({ eventTypeId, slug });
  if (!eventType) {
    return res.status(404).json({ message: "Event type not found" });
  }

  const availability = await getAvailabilityForDate({
    userId: 1,
    dateISO: date,
  });
  if (!availability || !availability.day) {
    return res.json({
      eventType,
      timezone: availability?.timezone ?? "UTC",
      slots: [],
    });
  }

  const slots = buildSlotsForDate({
    dateISO: date,
    timezone: availability.timezone,
    dayStart: availability.day.start_time,
    dayEnd: availability.day.end_time,
    durationMinutes: eventType.duration_min,
  });

  const dayStart = DateTime.fromISO(date, { zone: availability.timezone })
    .startOf("day")
    .toUTC()
    .toISO();
  const dayEnd = DateTime.fromISO(date, { zone: availability.timezone })
    .endOf("day")
    .toUTC()
    .toISO();

  const meetingsResult = await query(
    "SELECT start_at, end_at FROM meetings WHERE event_type_id = $1 AND status = 'scheduled' AND start_at >= $2 AND start_at <= $3",
    [eventType.id, dayStart, dayEnd]
  );

  const booked = meetingsResult.rows.map((meeting) => ({
    start: meeting.start_at,
    end: meeting.end_at,
  }));

  const availableSlots = slots.filter((slot) => {
    return !booked.some((meeting) => {
      const slotStart = DateTime.fromISO(slot.start);
      const slotEnd = DateTime.fromISO(slot.end);
      const meetingStart = DateTime.fromISO(meeting.start);
      const meetingEnd = DateTime.fromISO(meeting.end);
      return slotStart < meetingEnd && slotEnd > meetingStart;
    });
  });

  res.json({
    eventType,
    timezone: availability.timezone,
    slots: availableSlots,
  });
});

router.post("/", async (req, res) => {
  const {
    event_type_id,
    invitee_name,
    invitee_email,
    start_at,
    end_at,
  } = req.body;

  const conflictResult = await query(
    "SELECT id FROM meetings WHERE event_type_id = $1 AND status = 'scheduled' AND start_at < $2 AND end_at > $3",
    [event_type_id, end_at, start_at]
  );

  if (conflictResult.rows.length > 0) {
    return res.status(409).json({ message: "Time slot already booked" });
  }

  const created = await query(
    "INSERT INTO meetings (event_type_id, invitee_name, invitee_email, start_at, end_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, invitee_name, invitee_email, start_at, end_at, status",
    [event_type_id, invitee_name, invitee_email, start_at, end_at]
  );

  res.status(201).json(created.rows[0]);
});

export default router;
