import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Topbar from "../components/Topbar.jsx";
import {
  createEventType,
  deleteEventType,
  getEventTypes,
  updateEventType,
} from "../utils/api.js";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const EventTypesPage = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", duration_min: 30, slug: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchEventTypes = async () => {
    setLoading(true);
    try {
      const data = await getEventTypes();
      setEventTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  useEffect(() => {
    if (!editingId) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [form.name, editingId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateEventType(editingId, form);
      } else {
        await createEventType(form);
      }
      setForm({ name: "", duration_min: 30, slug: "" });
      setEditingId(null);
      await fetchEventTypes();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      duration_min: item.duration_min,
      slug: item.slug,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", duration_min: 30, slug: "" });
  };

  const bookingLinks = useMemo(
    () =>
      eventTypes.map((eventType) => ({
        ...eventType,
        link: `${window.location.origin}/book/${eventType.slug}`,
      })),
    [eventTypes]
  );

  return (
    <div className="page">
      <Topbar
        title="Event Types"
        subtitle="Define what you offer and share booking links with invitees."
        actions={<Button onClick={() => resetForm()}>New Event</Button>}
      />
      <div className="grid">
        <Card className="card-panel">
          <h2>{editingId ? "Edit event type" : "Create event type"}</h2>
          <p>Set the duration and link for your booking page.</p>
          <form className="form" onSubmit={onSubmit}>
            <label>
              Event name
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="30 Minute Project Fit"
                required
              />
            </label>
            <label>
              Duration (minutes)
              <input
                type="number"
                min="5"
                step="5"
                value={form.duration_min}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    duration_min: Number.parseInt(event.target.value, 10),
                  }))
                }
                required
              />
            </label>
            <label>
              Booking link
              <input
                value={form.slug}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, slug: event.target.value }))
                }
                placeholder="30-min-project-fit"
                required
              />
            </label>
            {error && <div className="form-error">{error}</div>}
            <div className="form-actions">
              <Button variant="primary" type="submit">
                {editingId ? "Save changes" : "Create event"}
              </Button>
              {editingId && (
                <Button variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
        <Card className="card-panel">
          <div className="list-header">
            <div>
              <h2>Live scheduling links</h2>
              <p>Share these with invitees to let them book time with you.</p>
            </div>
          </div>
          {loading ? (
            <div className="empty-state">Loading event types...</div>
          ) : (
            <div className="event-list">
              {bookingLinks.map((eventType) => (
                <div key={eventType.id} className="event-row">
                  <div>
                    <div className="event-name">{eventType.name}</div>
                    <div className="event-meta">
                      {eventType.duration_min} min | {eventType.link}
                    </div>
                  </div>
                  <div className="event-actions">
                    <Button
                      variant="ghost"
                      onClick={() => startEditing(eventType)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => deleteEventType(eventType.id).then(fetchEventTypes)}
                    >
                      Delete
                    </Button>
                    <a className="link-btn" href={`/book/${eventType.slug}`}>
                      Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EventTypesPage;
