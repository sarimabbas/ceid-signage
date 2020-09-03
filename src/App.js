import React, { useState, useEffect } from "react";
import Slide from "./components/slide";
import { db } from "./firebase";

const App = () => {
  const [userCount, setUserCount] = useState(0);
  const TOTAL_COUNT = 20;

  useEffect(() => {
    const unsubscribe = db.collection("users").onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.id);
      });
      setUserCount(users.length);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="App">
      <Slide userCount={userCount} totalCount={TOTAL_COUNT} />
    </div>
  );
};

export default App;
