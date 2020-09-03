import React, { useState, useEffect } from "react";
import { DateTime, Interval } from "luxon";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Sign from "./components/Sign";
import Admin from "./components/Admin";
import openIntervals from "./config/openIntervals";
import { db } from "./config/firebase";
import "./styles/tailwind.output.css";

const App = () => {
  // all the records of people who have swiped in
  const [userTable, setUserTable] = useState([]);

  // the maximum capacity e.g. 20
  const [capacityCount, setCapacityCount] = useState(0);

  // whether or not to close the CEID, dependent on several factors
  const [isOpen, setIsOpen] = useState(false);

  // check whether the CEID should be open everytime the database changes
  useEffect(() => {
    checkIsOpen();
  }, [userTable, capacityCount]);

  // check whether the CEID should be open every minute
  useEffect(() => {
    checkIsOpen();
    const interval = setInterval(() => {
      checkIsOpen();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkIsOpen = () => {
    const now = () =>
      DateTime.fromObject({
        weekday: DateTime.local().weekday,
        hour: DateTime.local().hour,
        minute: DateTime.local().minute,
      });
    // if there is a force close in the firebase, close the CEID
    // and don't even check the other conditions
    // TODO
    // if there are too many people, close the CEID,
    // and don't even check the other conditions
    if (userTable.length > 0 && userTable.length >= capacityCount) {
      console.log("setting to false because capacity reached");
      setIsOpen(false);
      return;
    }
    // if the current time lies outside any interval, close the CEID
    const isCurrentTimeWithinInterval = openIntervals.some((interval) => {
      return interval.contains(now());
    });
    console.log(
      `setting to ${isCurrentTimeWithinInterval} because of interval`
    );
    setIsOpen(isCurrentTimeWithinInterval);
  };

  useEffect(() => {
    const userListener = db.collection("users").onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.id);
      });
      setUserTable(users);
    });

    const capacityCountListener = db
      .collection("settings")
      .doc("capacity")
      .onSnapshot((doc) => {
        const capacity = doc.data().value;
        setCapacityCount(capacity);
      });

    return () => {
      userListener.unsubscribe();
      capacityCountListener.unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Sign
              userCount={userTable.length}
              capacityCount={capacityCount}
              isOpen={isOpen}
            />
          </Route>
          <Route path="/admin" exact>
            <Admin userTable={userTable} capacityCount={capacityCount} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
