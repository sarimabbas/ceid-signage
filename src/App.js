import React, { useState, useEffect } from "react";
import { DateTime, Interval } from "luxon";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Sign from "./components/Sign";
import EmbeddableSign from "./components/EmbeddableSign";
import Admin from "./components/Admin";
import { schedule, now } from "./config/openIntervals";
import { db } from "./config/firebase";
import { ScreenBurnLine } from "react-screen-burn";
import "./styles/tailwind.output.css";

const App = () => {
  // all the records of people who have swiped in
  const [userTable, setUserTable] = useState([]);

  // the maximum capacity e.g. 20
  const [capacityCount, setCapacityCount] = useState(0);

  // the admin emergency note (to close the CEID)
  const [emergencyNote, setEmergencyNote] = useState("");

  // whether or not to close the CEID, dependent on several factors
  const [isOpen, setIsOpen] = useState(false);

  const [timer, setTimer] = useState(null);

  // check whether the CEID should be open everytime the database changes
  useEffect(() => {
    checkIsOpen();
  }, [userTable, capacityCount, timer, emergencyNote]);

  // check whether the CEID should be open every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(new Date());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkIsOpen = () => {
    // if there is a force close in the firebase, close the CEID
    // and don't even check the other conditions
    let checkOne = !emergencyNote;

    console.log("check one", checkOne);

    // if there are too many people, close the CEID,
    // and don't even check the other conditions
    let checkTwo = !(userTable.length > 0 && userTable.length >= capacityCount);

    console.log("check two", checkTwo);

    // check if current time is within some interval
    let checkThree = schedule.some((interval) => {
      return interval.contains(now());
    });

    console.log("check three", checkThree);

    setIsOpen(checkOne && checkTwo && checkThree);
  };

  useEffect(() => {
    const userListener = db
      .collection("users")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          const uData = doc.data();
          users.push({
            id: doc.id,
            timestamp: DateTime.fromSeconds(uData?.timestamp?.seconds),
            notes: uData?.notes,
          });
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

    const emergencyNoteListener = db
      .collection("settings")
      .doc("emergency")
      .onSnapshot((doc) => {
        const note = doc.data().value;
        setEmergencyNote(note);
      });

    return () => {
      userListener.unsubscribe();
      capacityCountListener.unsubscribe();
      emergencyNoteListener.unsubscribe();
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
              emergencyNote={emergencyNote}
              isOpen={isOpen}
            />
          </Route>
          <Route path="/admin" exact>
            <Admin
              userTable={userTable}
              capacityCount={capacityCount}
              emergencyNote={emergencyNote}
            />
          </Route>
          <Route path="/embeddable" exact>
            <EmbeddableSign
              userCount={userTable.length}
              capacityCount={capacityCount}
              emergencyNote={emergencyNote}
              isOpen={isOpen}
            />
          </Route>
        </Switch>
      </Router>
      <ScreenBurnLine
        colors={["#ff0000", "#00ff00", "#0000ff"]}
        retriggerTime={1800000}
        size={5}
        triggerTime={1800000}
      />
    </div>
  );
};

export default App;
