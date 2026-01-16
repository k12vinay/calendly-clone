import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Topbar from "../components/Topbar.jsx";
import Calendar from "../components/Calendar.jsx";
import {
  getAvailability,
  updateAvailability,
  getOverride,
  setOverride,
  deleteOverride,
} from "../utils/api.js";

const days = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Singapore",
  "Asia/Kolkata",
];

const AvailabilityPage = () => {
  const [timezone, setTimezone] = useState("America/New_York");
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Override states
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [override, setOverrideData] = useState(null);
  const [loadingOverride, setLoadingOverride] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getAvailability();
      setTimezone(data.timezone || "America/New_York");
      setAvailabilityDays(data.days || []);
    };
    load();
  }, []);

  const dateISO = useMemo(() => {
    if (!selectedDate) return null;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  useEffect(() => {
    if (!dateISO) {
      setOverrideData(null);
      return;
    }
    const loadOverride = async () => {
      setLoadingOverride(true);
      try {
        const data = await getOverride(dateISO);
        if (data) {
          setOverrideData(data);
        } else {
          // Default to "available" with standard hours if no override exists
          setOverrideData({
            is_unavailable: false,
            start_time: "09:00",
            end_time: "17:00",
            isNew: true, // Marker to show it's not saved yet
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOverride(false);
      }
    };
    loadOverride();
  }, [dateISO]);

  const toggleDay = (dayValue) => {
    const exists = availabilityDays.find((day) => day.day_of_week === dayValue);
    if (exists) {
      setAvailabilityDays((prev) =>
        prev.filter((day) => day.day_of_week !== dayValue)
      );
    } else {
      setAvailabilityDays((prev) => [
        ...prev,
        { day_of_week: dayValue, start_time: "09:00", end_time: "17:00" },
      ]);
    }
  };

  const updateTime = (dayValue, field, value) => {
    setAvailabilityDays((prev) =>
      prev.map((day) =>
        day.day_of_week === dayValue ? { ...day, [field]: value } : day
      )
    );
  };

  const saveAvailability = async () => {
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        timezone,
        days: availabilityDays.sort((a, b) => a.day_of_week - b.day_of_week),
      };
      await updateAvailability(payload);
      setMessage("Availability updated.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOverride = async () => {
    if (!dateISO || !override) return;
    try {
      await setOverride(dateISO, {
        start_time: override.start_time,
        end_time: override.end_time,
        is_unavailable: override.is_unavailable,
      });
      // Refresh to get the saved state (removes isNew)
      const data = await getOverride(dateISO);
      setOverrideData(data);
      setMessage(`Hours for ${dateISO} updated.`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDeleteOverride = async () => {
    if (!dateISO) return;
    try {
      await deleteOverride(dateISO);
      setOverrideData({
        is_unavailable: false,
        start_time: "09:00",
        end_time: "17:00",
        isNew: true,
      });
      setMessage(`Restored default hours for ${dateISO}.`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="page">
      <Topbar
        title="Availability"
        subtitle="Control when you are open for meetings and keep your schedule consistent."
        actions={
          <Button variant="primary" onClick={saveAvailability}>
            {saving ? "Saving..." : "Save Weekly Hours"}
          </Button>
        }
      />
      <div className="grid">
        <Card className="card-panel">
          <h2>Weekly hours</h2>
          <p>Select the days you are available and set hours for each day.</p>
          <div className="availability-grid">
            {days.map((day) => {
              const active = availabilityDays.find(
                (item) => item.day_of_week === day.value
              );
              return (
                <div key={day.value} className="availability-row">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={Boolean(active)}
                      onChange={() => toggleDay(day.value)}
                    />
                    <span>{day.label}</span>
                  </label>
                  {active ? (
                    <div className="time-range">
                      <input
                        type="time"
                        value={active.start_time}
                        onChange={(event) =>
                          updateTime(day.value, "start_time", event.target.value)
                        }
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={active.end_time}
                        onChange={(event) =>
                          updateTime(day.value, "end_time", event.target.value)
                        }
                      />
                    </div>
                  ) : (
                    <div className="time-range muted">Unavailable</div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="card-panel">
          <h2>Date-specific hours</h2>
          <p>Override your availability for specific dates.</p>
          <div className="booking-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <Calendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onChangeMonth={setCurrentMonth}
              />
            </div>
            <div>
              {!selectedDate ? (
                <div className="empty-state" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  Select a date to set overrides.
                </div>
              ) : loadingOverride ? (
                <div className="empty-state">Loading...</div>
              ) : (
                <div className="override-form form">
                  <h3>{selectedDate.toDateString()}</h3>
                  <label className="checkbox" style={{ marginBottom: "1rem" }}>
                    <input
                      type="checkbox"
                      checked={override?.is_unavailable || false}
                      onChange={(e) =>
                        setOverrideData((prev) => ({
                          ...prev,
                          is_unavailable: e.target.checked,
                        }))
                      }
                    />
                    <span>Mark as unavailable</span>
                  </label>

                  {!override?.is_unavailable && (
                    <div className="time-range" style={{ marginBottom: "1rem" }}>
                      <input
                        type="time"
                        value={override?.start_time || "09:00"}
                        onChange={(e) =>
                          setOverrideData((prev) => ({
                            ...prev,
                            start_time: e.target.value,
                          }))
                        }
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={override?.end_time || "17:00"}
                        onChange={(e) =>
                          setOverrideData((prev) => ({
                            ...prev,
                            end_time: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div className="form-actions">
                    <Button variant="primary" onClick={handleSaveOverride}>
                      Apply Override
                    </Button>
                    {!override?.isNew && (
                      <Button variant="ghost" onClick={handleDeleteOverride}>
                        Restore Default
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="card-panel">
          <h2>Timezone</h2>
          <p>Use this timezone when showing available slots to invitees.</p>
          <div className="form">
            <label>
              Timezone
              <select value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </label>
            {message && <div className="form-error">{message}</div>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AvailabilityPage;
