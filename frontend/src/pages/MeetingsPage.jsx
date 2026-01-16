import React, { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Badge from "../components/Badge.jsx";
import Topbar from "../components/Topbar.jsx";
import { cancelMeeting, getMeetings } from "../utils/api.js";

const formatDate = (value) =>
  new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const MeetingsPage = () => {
  const [tab, setTab] = useState("upcoming");
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMeetings = async () => {
    setLoading(true);
    const data = await getMeetings(tab);
    setMeetings(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMeetings();
  }, [tab]);

  const handleCancel = async (id) => {
    await cancelMeeting(id);
    await loadMeetings();
  };

  return (
    <div className="page">
      <Topbar
        title="Meetings"
        subtitle="Track upcoming sessions and follow up on past conversations."
        actions={
          <div className="tab-list">
            <button
              className={tab === "upcoming" ? "active" : ""}
              onClick={() => setTab("upcoming")}
              type="button"
            >
              Upcoming
            </button>
            <button
              className={tab === "past" ? "active" : ""}
              onClick={() => setTab("past")}
              type="button"
            >
              Past
            </button>
          </div>
        }
      />
      <Card className="card-panel">
        {loading ? (
          <div className="empty-state">Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="empty-state">No meetings to show.</div>
        ) : (
          <div className="meeting-list">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="meeting-row">
                <div>
                  <div className="meeting-title">{meeting.event_name}</div>
                  <div className="meeting-meta">
                    {meeting.invitee_name} | {meeting.invitee_email}
                  </div>
                  <div className="meeting-meta">{formatDate(meeting.start_at)}</div>
                </div>
                <div className="meeting-actions">
                  <Badge tone={meeting.status === "canceled" ? "neutral" : "success"}>
                    {meeting.status}
                  </Badge>
                  {tab === "upcoming" && meeting.status === "scheduled" && (
                    <Button variant="ghost" onClick={() => handleCancel(meeting.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MeetingsPage;
