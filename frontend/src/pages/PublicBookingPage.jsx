import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Calendar from "../components/Calendar.jsx";
import {
  createBooking,
  getEventTypeBySlug,
  getSlots,
} from "../utils/api.js";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const PublicBookingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState(null);
  const [status, setStatus] = useState("loading");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [timezone, setTimezone] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [invitee, setInvitee] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await getEventTypeBySlug(slug);
      if (!data) {
        setStatus("missing");
        return;
      }
      setEventType(data);
      setStatus("ready");
    };
    load();
  }, [slug]);

  const dateISO = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  useEffect(() => {
    if (!eventType) return;
    const loadSlots = async () => {
      const data = await getSlots({ date: dateISO, slug: eventType.slug });
      setSlots(data.slots || []);
      setTimezone(data.timezone || "");
      setSelectedSlot(null);
    };
    loadSlots();
  }, [eventType, dateISO]);

  const submitBooking = async (event) => {
    event.preventDefault();
    setError("");
    if (!selectedSlot) {
      setError("Select a time to continue.");
      return;
    }
    try {
      const booking = await createBooking({
        event_type_id: eventType.id,
        invitee_name: invitee.name,
        invitee_email: invitee.email,
        start_at: selectedSlot.start,
        end_at: selectedSlot.end,
      });
      navigate(`/book/${eventType.slug}/confirm`, {
        state: {
          booking,
          eventType,
          timezone,
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === "loading") {
    return (
      <div className="booking-shell">
        <Card className="booking-card">Loading event...</Card>
      </div>
    );
  }

  if (status === "missing") {
    return (
      <div className="booking-shell">
        <Card className="booking-card">
          <h1>Event not found</h1>
          <p>This booking link is no longer available.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="booking-shell">
      <Card className="booking-card">
        <div className="booking-header">
          <div>
            <div className="booking-label">{eventType.duration_min} min meeting</div>
            <h1>{eventType.name}</h1>
            <p className="booking-subtitle">
              Select a day and time that works for you.
            </p>
          </div>
          <div className="booking-meta">
            <div className="pill">Timezone: {timezone || ""}</div>
            <div className="pill">Online meeting</div>
          </div>
        </div>
        <div className="booking-grid">
          <div>
            <Calendar
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onChangeMonth={setCurrentMonth}
            />
          </div>
          <div>
            <div className="slot-panel">
              <div className="slot-header">
                <h3>{formatDate(selectedDate)}</h3>
                <p>{slots.length} available times</p>
              </div>
              <div className="slot-list">
                {slots.length === 0 ? (
                  <div className="empty-state">No times available.</div>
                ) : (
                  slots.map((slot) => (
                    <button
                      key={slot.start}
                      className={`slot-btn ${
                        selectedSlot?.start === slot.start ? "selected" : ""
                      }`}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
          <div>
            <form className="form" onSubmit={submitBooking}>
              <h3>Enter details</h3>
              <label>
                Name
                <input
                  value={invitee.name}
                  onChange={(event) =>
                    setInvitee((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={invitee.email}
                  onChange={(event) =>
                    setInvitee((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
              </label>
              {error && <div className="form-error">{error}</div>}
              <Button variant="primary" type="submit">
                Confirm booking
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PublicBookingPage;
