import React from "react";

const Button = ({ children, onClick, classes }) => {
  return (
    <button
      className={`bg-blue-600 text-white px-4 py-2 ${classes && classes}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
