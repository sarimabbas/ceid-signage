import { DateTime, Interval, Duration } from "luxon";

const now = () =>
  DateTime.fromObject({
    weekday: DateTime.local().weekday,
    hour: DateTime.local().hour,
    minute: DateTime.local().minute,
  });

const monday = [
  // 1:-0 - 2:30 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 1,
      hour: "13",
      minute: "00",
    }),
    DateTime.fromObject({
      weekday: 1,
      hour: "14",
      minute: "30",
    })
  ),
  // 3:00 - 4:30 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 1,
      hour: "15",
      minute: "00",
    }),
    DateTime.fromObject({
      weekday: 1,
      hour: "16",
      minute: "30",
    })
  ),
  // 5:00 - 6:30 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 1,
      hour: "17",
      minute: "00",
    }),
    DateTime.fromObject({
      weekday: 1,
      hour: "18",
      minute: "30",
    })
  ),
  // 7:00 - 9:00 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 1,
      hour: "19",
      minute: "00",
    }),
    DateTime.fromObject({
      weekday: 1,
      hour: "21",
      minute: "00",
    })
  ),
];

const tuesday = monday.map((interval) =>
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 2,
      hour: interval.start.hour,
      minute: interval.start.minute,
    }),
    DateTime.fromObject({
      weekday: 2,
      hour: interval.end.hour,
      minute: interval.end.minute,
    })
  )
);

const wednesday = monday.map((interval) =>
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 3,
      hour: interval.start.hour,
      minute: interval.start.minute,
    }),
    DateTime.fromObject({
      weekday: 3,
      hour: interval.end.hour,
      minute: interval.end.minute,
    })
  )
);

const thursday = [
  // 5:00 - 6:30 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 4,
      hour: "17",
      minute: "00",
    }),
    DateTime.fromObject({
      weekday: 4,
      hour: "18",
      minute: "30",
    })
  ),
  // 7:00 - 9:00 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 4,
      hour: "19",
      minute: "00",
    }),
    DateTime.fromObject({
      weekday: 4,
      hour: "21",
      minute: "00",
    })
  ),
];

const friday = monday.map((interval) =>
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 5,
      hour: interval.start.hour,
      minute: interval.start.minute,
    }),
    DateTime.fromObject({
      weekday: 5,
      hour: interval.end.hour,
      minute: interval.end.minute,
    })
  )
);

const thisWeek = [...monday, ...tuesday, ...wednesday, ...thursday, ...friday];

const nextWeek = thisWeek.map((interval) =>
  interval.mapEndpoints((endpoint) => endpoint.plus({ days: 7 }))
);

const schedule = [...thisWeek, ...nextWeek];

const isNowInSchedule = () =>
  schedule.some((interval) => interval.contains(now()));

export { schedule, now, isNowInSchedule };
