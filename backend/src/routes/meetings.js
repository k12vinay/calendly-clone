import express from "express";
import { DateTime } from "luxon";
import { query } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { status } = req.query;
  const now = DateTime.utc().toISO();

  let clause = "";
  const params = [];

  if (status === "upcoming") {
    clause = "WHERE meetings.status = 'scheduled' AND meetings.start_at >= $1";
    params.push(now);
  } else if (status === "past") {
    clause = "WHERE (meetings.status = 'scheduled' AND meetings.start_at < $1) OR meetings.status = 'canceled'";
    params.push(now);
  }

  const result = await query(
    `SELECT meetings.id, meetings.invitee_name, meetings.invitee_email, meetings.start_at, meetings.end_at, meetings.status, event_types.name AS event_name
     FROM meetings
     JOIN event_types ON event_types.id = meetings.event_type_id
     ${clause}
     ORDER BY meetings.start_at DESC`,
    params
  );

  res.json(result.rows);
});

router.post("/:id/cancel", async (req, res) => {
  const { id } = req.params;
  const result = await query(
    "UPDATE meetings SET status = 'canceled', canceled_at = NOW() WHERE id = $1 RETURNING id, status, canceled_at",
    [id]
  );
  res.json(result.rows[0]);
});

export default router;
