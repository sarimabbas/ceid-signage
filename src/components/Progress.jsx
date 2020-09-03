import React from "react";

export default ({ max, value }) => {
  const calculateWidth = () => {
    return (value / max) * 100.0;
  };

  const calculateColor = () => {
    const width = calculateWidth();
    if (value >= max) {
      return "#D40E0E";
    } else if (width > 50.0) {
      return "#D4A20E"; // yellow
    } else {
      return "#7CD40E"; // green
    }
  };

  return (
    <div className="w-full h-8 overflow-hidden border rounded-md md:w-6/12">
      <div
        className="h-full rounded-md progress-ease"
        style={{
          width: calculateWidth() + "%",
          backgroundColor: calculateColor(),
        }}
      ></div>
    </div>
  );
};
