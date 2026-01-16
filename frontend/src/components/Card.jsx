import React from "react";

const Card = ({ children, className = "" }) => {
  return <div className={`card ${className}`.trim()}>{children}</div>;
};

export default Card;
