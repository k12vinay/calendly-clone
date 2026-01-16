import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">C</span>
        <div>
          <div className="brand-title">Calendly</div>
          <div className="brand-subtitle">Scheduling Hub</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end>
          Event Types
        </NavLink>
        <NavLink to="/availability">Availability</NavLink>
        <NavLink to="/meetings">Meetings</NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="avatar">AM</div>
          <div>
            <div className="user-name">Alex Morgan</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
