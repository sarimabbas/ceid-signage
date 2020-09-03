import React, { useState, useEffect } from "react";
import "./slide.css";
import { DateTime, Interval } from "luxon";
import openIntervals from "./openIntervals";

export default ({ userCount, totalCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOpenInterval, setCurrentOpenInterval] = useState(null);
  const [now, setNow] = useState(DateTime.local());

  const renderInterval = (interval) => {
    return (
      <h3>
        {interval.start.toLocaleString({
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {interval.end.toLocaleString({
          hour: "2-digit",
          minute: "2-digit",
        })}
      </h3>
    );
  };

  const checkIsOpen = () => {
    const now = DateTime.local();
    const isOpen = openIntervals.some((interval) => {
      const doesContain = interval.contains(now);
      if (doesContain) {
        setCurrentOpenInterval(interval);
      }
      return doesContain;
    });
    setNow(now);
    setIsOpen(isOpen);
  };

  useEffect(() => {
    // initially
    checkIsOpen();

    // every minute
    const interval = setInterval(() => {
      console.log("MINUTE TICK");
      checkIsOpen();
    }, 60 * 1000);

    // clear the interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="slide"
      style={{ backgroundColor: isOpen ? "#31A926" : "#A9264C" }}
    >
      {/* current date */}
      <h3>
        {now.toLocaleString({
          weekday: "long",
          month: "long",
          day: "2-digit",
        })}
      </h3>
      {/* title */}
      {isOpen ? (
        <h1>The CEID is open for walk-ins.</h1>
      ) : (
        <h1>The CEID is closed. Please come again later.</h1>
      )}
      {/* slots remaining */}
      <br />
      {<h2>{totalCount - userCount} slots remaining.</h2>}
      {/* current interval */}
      {currentOpenInterval ? (
        <div>
          <br />
          <h2 style={{ margin: 0, marginRight: 20 }}>Current slot</h2>
          <br />
          {renderInterval(currentOpenInterval)}
        </div>
      ) : null}

      {/* upcoming intervals */}
      <br />
      <br />
      <h2>Today's slots</h2>
      <br />
      {openIntervals.map((interval) => renderInterval(interval))}
    </div>
  );
};
