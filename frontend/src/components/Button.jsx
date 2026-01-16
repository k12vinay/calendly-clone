import React from "react";

const Button = ({ variant = "primary", children, className = "", ...props }) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`.trim()}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
