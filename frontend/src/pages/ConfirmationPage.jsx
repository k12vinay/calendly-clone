import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Card from "../components/Card.jsx";

const ConfirmationPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { booking, eventType, timezone } = location.state || {};

  if (!booking || !eventType) {
    return (
      <div className="booking-shell">
        <Card className="booking-card">
          <h1>Booking not found</h1>
          <p>Please return to the event page and choose a time.</p>
          <Link to={`/book/${slug}`} className="link-btn">
            Back to booking
          </Link>
        </Card>
      </div>
    );
  }

  const start = new Date(booking.start_at).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="booking-shell">
      <Card className="booking-card">
        <div className="confirm-header">
          <div className="confirm-icon">OK</div>
          <div>
            <h1>Confirmed</h1>
            <p>Your meeting is scheduled.</p>
          </div>
        </div>
        <div className="confirm-details">
          <div>
            <div className="detail-label">Event</div>
            <div>{eventType.name}</div>
          </div>
          <div>
            <div className="detail-label">When</div>
            <div>{start}</div>
          </div>
          <div>
            <div className="detail-label">Timezone</div>
            <div>{timezone}</div>
          </div>
          <div>
            <div className="detail-label">Invitee</div>
            <div>
              {booking.invitee_name} ({booking.invitee_email})
            </div>
          </div>
        </div>
        <div className="confirm-actions">
          <Link to="/" className="link-btn">
            Back to admin
          </Link>
          <Link to={`/book/${eventType.slug}`} className="link-btn">
            Book another time
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationPage;
