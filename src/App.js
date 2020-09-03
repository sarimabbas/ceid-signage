import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Slide from "./components/Slide";
import Admin from "./components/Admin";
import { db } from "./config/firebase";
import "./styles/tailwind.output.css";

const App = () => {
  const [userTable, setUserTable] = useState([]);

  const [capacityCount, setCapacityCount] = useState(0);

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
            <Slide userCount={userTable.length} capacityCount={capacityCount} />
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
