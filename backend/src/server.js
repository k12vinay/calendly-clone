import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventTypesRouter from "./routes/eventTypes.js";
import availabilityRouter from "./routes/availability.js";
import bookingsRouter from "./routes/bookings.js";
import meetingsRouter from "./routes/meetings.js";
import overridesRouter from "./routes/overrides.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/event-types", eventTypesRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/meetings", meetingsRouter);
app.use("/api/overrides", overridesRouter);

const port = Number.parseInt(process.env.PORT || "4000", 10);
app.listen(port, () => {
  console.log(`API listening on ${port}`);
});
