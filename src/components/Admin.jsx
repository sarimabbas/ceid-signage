import React from "react";
import { db } from "../config/firebase";

export default ({ userTable, capacityCount }) => {
  const setCapacity = (event) => {
    db.collection("settings").doc("capacity").set({
      value: event.target.value,
    });
  };

  const deleteSignIns = async () => {
    const querySnapshot = await db.collection("users").get();
    querySnapshot.forEach((doc) => {
      db.collection("users").doc(doc.id).delete();
    });
  };

  const deleteSignIn = async (id) => {
    await db.collection("users").doc(id).delete();
  };

  const updateNote = async (id, notes) => {
    await db.collection("users").doc(id).update({
      notes: notes,
    });
  };

  return (
    <div className="container p-4 mx-auto">
      {/* Heading */}
      <h1 className="mb-2 text-4xl">Admin panel</h1>

      {/* sign in table */}
      <div className="p-4 mb-8 bg-gray-100 border border-solid rounded-md shadow-sm">
        <h2 className="mb-8 text-2xl border-b">Sign in table:</h2>
        <table>
          <thead>
            <tr>
              {userTable.length ? (
                <>
                  <th>Unique ID</th>
                  <th>Timestamp</th>
                  <th>Notes</th>
                  <th>Delete</th>
                </>
              ) : (
                <th>
                  No sign ins yet. Swipe an ID and it should show up here.
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {userTable.map((u, i) => (
              <tr key={u?.id ?? i}>
                <td>{u?.id}</td>
                <td>
                  {u?.timestamp?.toLocaleString({
                    weekday: "short",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-2 pl-5">
                  <input
                    type="text"
                    className="p-1 border rounded-md"
                    value={u?.notes}
                    onChange={(e) => updateNote(u?.id, e.target.value)}
                    placeholder="Add notes here..."
                  />
                </td>
                <td className="pl-5">
                  <a
                    className="cursor-pointer hover:text-indigo-400"
                    onClick={() => deleteSignIn(u?.id)}
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* counts summary */}
      <div className="p-4 mb-8 bg-gray-100 border border-solid rounded-md shadow-sm">
        <h2 className="mb-2 text-2xl border-b">Counts summary</h2>
        <h3 className="text-xl">
          Total capacity: <code>{capacityCount}</code>
        </h3>
        <h3 className="text-xl">
          Current users: <code>{userTable.length}</code>
        </h3>
        <h3 className="text-xl">
          Remaining slots: <code>{capacityCount - userTable.length}</code>
        </h3>
      </div>

      {/* settings */}
      <div className="p-4 mb-8 bg-gray-100 border border-solid rounded-md shadow-sm">
        <h2 className="mb-2 text-2xl border-b">Settings</h2>
        {/* set capacity */}
        <div className="flex items-center mb-4">
          <h3 className="mr-4 text-xl">Set total capacity</h3>
          <input
            type="number"
            className="p-2 border rounded-md shadow-sm"
            value={capacityCount}
            onChange={setCapacity}
          />
        </div>
        {/* delete sign ins */}
        <div className="flex items-center">
          <h3 className="mr-4 text-xl">Delete Sign Ins (reset table)</h3>
          <button
            className="p-2 text-white bg-red-600 rounded-md shadow-sm hover:bg-red-800"
            onClick={deleteSignIns}
          >
            Delete sign ins
          </button>
        </div>
      </div>
    </div>
  );
};
