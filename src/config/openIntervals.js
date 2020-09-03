import { DateTime, Interval } from "luxon";

export default [
  // 10:30 - 12:00 noon
  Interval.fromDateTimes(
    DateTime.fromObject({
      hour: "10",
      minute: "30",
    }),
    DateTime.fromObject({
      hour: "12",
      minute: "00",
    })
  ),
  // 12:30 - 2:00 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      hour: "12",
      minute: "30",
    }),
    DateTime.fromObject({
      hour: "14",
      minute: "00",
    })
  ),
  // 2:30 - 4:00 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      hour: "14",
      minute: "30",
    }),
    DateTime.fromObject({
      hour: "16",
      minute: "00",
    })
  ),
  // 4:30 - 5:30 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      hour: "16",
      minute: "30",
    }),
    DateTime.fromObject({
      hour: "17",
      minute: "30",
    })
  ),
];
