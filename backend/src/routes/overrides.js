import express from "express";
import { query, getDefaultUserId } from "../db.js";

const router = express.Router();

const getAvailabilityId = async (userId) => {
    const result = await query(
        "SELECT id FROM availability WHERE user_id = $1 LIMIT 1",
        [userId]
    );
    return result.rows[0]?.id;
};

router.get("/:date", async (req, res) => {
    const { date } = req.params;
    const userId = getDefaultUserId();
    const availabilityId = await getAvailabilityId(userId);

    if (!availabilityId) {
        return res.json(null);
    }

    const result = await query(
        "SELECT date, start_time, end_time, is_unavailable FROM availability_overrides WHERE availability_id = $1 AND date = $2",
        [availabilityId, date]
    );
    res.json(result.rows[0] || null);
});

router.put("/:date", async (req, res) => {
    const { date } = req.params;
    const { start_time, end_time, is_unavailable } = req.body;
    const userId = getDefaultUserId();
    const availabilityId = await getAvailabilityId(userId);

    if (!availabilityId) {
        return res.status(404).json({ message: "Availability not set" });
    }

    // Upsert logic
    await query(
        `INSERT INTO availability_overrides (availability_id, date, start_time, end_time, is_unavailable)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (availability_id, date)
       DO UPDATE SET start_time = $3, end_time = $4, is_unavailable = $5`,
        [availabilityId, date, start_time, end_time, is_unavailable]
    );

    // Return the updated record
    const result = await query(
        "SELECT date, start_time, end_time, is_unavailable FROM availability_overrides WHERE availability_id = $1 AND date = $2",
        [availabilityId, date]
    );

    res.json(result.rows[0]);
});

router.delete("/:date", async (req, res) => {
    const { date } = req.params;
    const userId = getDefaultUserId();
    const availabilityId = await getAvailabilityId(userId);

    if (availabilityId) {
        await query(
            "DELETE FROM availability_overrides WHERE availability_id = $1 AND date = $2",
            [availabilityId, date]
        );
    }

    res.status(204).send();
});

export default router;
