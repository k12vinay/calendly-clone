import express from "express";
import { query, getDefaultUserId } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = getDefaultUserId();
  const result = await query(
    "SELECT id, name, duration_min, slug FROM event_types WHERE user_id = $1 ORDER BY id",
    [userId]
  );
  res.json(result.rows);
});

router.post("/", async (req, res) => {
  const { name, duration_min, slug } = req.body;
  const userId = getDefaultUserId();
  const result = await query(
    "INSERT INTO event_types (user_id, name, duration_min, slug) VALUES ($1, $2, $3, $4) RETURNING id, name, duration_min, slug",
    [userId, name, duration_min, slug]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, duration_min, slug } = req.body;
  const result = await query(
    "UPDATE event_types SET name = $1, duration_min = $2, slug = $3 WHERE id = $4 RETURNING id, name, duration_min, slug",
    [name, duration_min, slug, id]
  );
  res.json(result.rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await query("DELETE FROM event_types WHERE id = $1", [id]);
  res.status(204).send();
});

export default router;
