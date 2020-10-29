import React from "react";
import Logo from "../assets/logo.png";
import { schedule, now, isNowInSchedule } from "../config/openIntervals";
import ProgressBar from "./Progress";
import { ReactComponent as OpenIcon } from "../assets/open.svg";
import { ReactComponent as AlertIcon } from "../assets/alert.svg";

export default ({ userCount, capacityCount, isOpen, emergencyNote }) => {
  const getCurrentInterval = () => {
    let retInterval = null;
    schedule.some((interval) => {
      if (interval.contains(now())) {
        retInterval = interval;
      }
    });
    if (retInterval) {
      return (
        <div className="flex flex-col items-center">
          <h2 className="my-6 text-3xl">The current work window is:</h2>
          <div className="text-4xl">{renderInterval(retInterval)}</div>
        </div>
      );
    }
    return null;
  };

  const getNextInterval = () => {
    let counter = 0;
    let copyIntervals = [...schedule];
    const currTime = now();
    while (currTime > copyIntervals[counter].start) {
      counter += 1;
    }
    return (
      <div className="flex flex-col items-center">
        <h2 className="my-6 text-3xl">The next work window is:</h2>
        <div className="text-4xl">{renderInterval(schedule[counter])}</div>
      </div>
    );
  };

  const renderInterval = (interval) => {
    if (!interval) {
      return null;
    }
    return (
      <h3>
        {interval.start.toLocaleString({
          weekday: "short",
          month: "short",
          day: "2-digit",
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

  return (
    <div className="container w-full h-full p-4 mx-auto text-center">
      {/* logo */}
      <img
        src={Logo}
        alt="CEID logo"
        className="mx-auto mt-12 mb-12"
        width="500"
      />
      {/* body */}
      <div
        id="center"
        className="flex flex-col items-center justify-center w-full"
      >
        {/* open or closed */}
        {isOpen ? (
          <div className="flex flex-col items-center">
            <OpenIcon width="150" color="green" />
            <p className="text-6xl">We are open.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <AlertIcon width="150" color="orange" />
            {/* there are two situations you might not be open */}
            {/* either the schedule does not permit */}
            {/* or the max capacity has been reached */}
            <p className="text-6xl">
              {!isNowInSchedule()
                ? "The CEID is Operational."
                : emergencyNote ?? "We are currently at maximum capacity."}
            </p>
          </div>
        )}
        {/* capacity */}
        {/* <p>We've got {capacityCount - userCount} slots left.</p> */}
        {isOpen ? (
          <>
            <h2 className="mt-20 mb-3 text-3xl" id="capacity">
              Capacity:
            </h2>
            <ProgressBar value={userCount} max={capacityCount} />
          </>
        ) : null}
        <br />
        {/* show current time interval, if within one, otherwise show all*/}
        {getCurrentInterval() ? (
          <div className="mt-10">{getCurrentInterval()}</div>
        ) : (
          <div className="mt-10">{getNextInterval()}</div>
        )}
        <br />
      </div>
    </div>
  );
};
