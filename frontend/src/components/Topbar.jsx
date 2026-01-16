import React from "react";

const Topbar = ({ title, subtitle, actions }) => {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="topbar-actions">{actions}</div>}
    </header>
  );
};

export default Topbar;
