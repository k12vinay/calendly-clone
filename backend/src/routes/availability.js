import express from "express";
import { query, getDefaultUserId } from "../db.js";

const router = express.Router();

const buildAvailabilityPayload = (availability, days) => ({
  id: availability?.id ?? null,
  timezone: availability?.timezone ?? "America/New_York",
  days,
});

router.get("/", async (req, res) => {
  const userId = getDefaultUserId();
  const availabilityResult = await query(
    "SELECT id, timezone FROM availability WHERE user_id = $1 LIMIT 1",
    [userId]
  );
  const availability = availabilityResult.rows[0];
  if (!availability) {
    return res.json(buildAvailabilityPayload(null, []));
  }

  const daysResult = await query(
    "SELECT day_of_week, start_time, end_time FROM availability_days WHERE availability_id = $1 ORDER BY day_of_week",
    [availability.id]
  );
  res.json(buildAvailabilityPayload(availability, daysResult.rows));
});

router.put("/", async (req, res) => {
  const userId = getDefaultUserId();
  const { timezone, days } = req.body;

  const availabilityResult = await query(
    "SELECT id FROM availability WHERE user_id = $1 LIMIT 1",
    [userId]
  );
  let availabilityId = availabilityResult.rows[0]?.id;

  if (!availabilityId) {
    const created = await query(
      "INSERT INTO availability (user_id, timezone) VALUES ($1, $2) RETURNING id",
      [userId, timezone]
    );
    availabilityId = created.rows[0].id;
  } else {
    await query("UPDATE availability SET timezone = $1 WHERE id = $2", [
      timezone,
      availabilityId,
    ]);
  }

  await query("DELETE FROM availability_days WHERE availability_id = $1", [
    availabilityId,
  ]);

  for (const day of days) {
    await query(
      "INSERT INTO availability_days (availability_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4)",
      [availabilityId, day.day_of_week, day.start_time, day.end_time]
    );
  }

  const responseDays = await query(
    "SELECT day_of_week, start_time, end_time FROM availability_days WHERE availability_id = $1 ORDER BY day_of_week",
    [availabilityId]
  );

  res.json(
    buildAvailabilityPayload(
      { id: availabilityId, timezone },
      responseDays.rows
    )
  );
});

export default router;
