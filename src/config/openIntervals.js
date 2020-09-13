import { DateTime, Interval, Duration } from "luxon";

const now = () =>
  DateTime.fromObject({
    weekday: DateTime.local().weekday,
    hour: DateTime.local().hour,
    minute: DateTime.local().minute,
  });

const monday = [
  // 10:30 - 12:00 noon
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 1,
      hour: "10",
      minute: "30",
    }),
    DateTime.fromObject({
      weekday: 1,
      hour: "12",
      minute: "00",
    })
  ),
  // 12:30 - 2:00 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 1,
      hour: "12",
      minute: "30",
    }),
    DateTime.fromObject({
      weekday: 1,
      hour: "14",
      minute: "00",
    })
  ),
  // 2:30 - 4:00 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 1,
      hour: "14",
      minute: "30",
    }),
    DateTime.fromObject({
      weekday: 1,
      hour: "16",
      minute: "00",
    })
  ),
  // 4:30 - 6:00 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 1,
      hour: "16",
      minute: "30",
    }),
    DateTime.fromObject({
      weekday: 1,
      hour: "18",
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
  // 4:30 - 6:00 PM
  Interval.fromDateTimes(
    DateTime.fromObject({
      weekday: 4,
      hour: "16",
      minute: "30",
    }),
    DateTime.fromObject({
      weekday: 4,
      hour: "18",
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
