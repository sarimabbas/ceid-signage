import React from "react";
import Logo from "../assets/logo.png";
import { DateTime, Interval } from "luxon";
import openIntervals from "../config/openIntervals";
import ProgressBar from "./Progress";
import { ReactComponent as OpenIcon } from "../assets/open.svg";
import { ReactComponent as ClosedIcon } from "../assets/closed.svg";

export default ({ userCount, capacityCount, isOpen }) => {
  const now = () =>
    DateTime.fromObject({
      weekday: DateTime.local().weekday,
      hour: DateTime.local().hour,
      minute: DateTime.local().minute,
    });

  const getCurrentInterval = () => {
    let retInterval = null;
    openIntervals.some((interval) => {
      if (interval.contains(now())) {
        retInterval = interval;
      }
    });
    if (retInterval) {
      return (
        <div className="flex flex-col items-center">
          <h2 className="my-6 text-3xl">The current walk-in time is:</h2>
          <div className="text-4xl">{renderInterval(retInterval)}</div>
        </div>
      );
    }
    return null;
  };

  const getNextInterval = () => {
    return (
      <div className="flex flex-col items-center">
        <h2 className="my-6 text-3xl">The next walk-in time is:</h2>
        {openIntervals.map((i, index) => (
          <div className="text-2xl" key={index}>
            {renderInterval(i)}
          </div>
        ))}
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
    <div className="container w-full h-full p-4 mx-auto">
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
            <ClosedIcon width="150" color="red" />
            <p className="text-6xl">We are closed.</p>
          </div>
        )}
        {/* show current time interval, if within one, otherwise show all*/}
        {getCurrentInterval() ? (
          <div className="mt-10">{getCurrentInterval()}</div>
        ) : (
          getNextInterval()
        )}

        {/* capacity */}
        {/* <p>We've got {capacityCount - userCount} slots left.</p> */}
        <h2 className="mt-20 mb-3 text-3xl">Capacity:</h2>
        <ProgressBar value={userCount} max={capacityCount} />
      </div>
    </div>
  );
};
