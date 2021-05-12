const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const firestore = admin.firestore();

exports.swipeCard = functions.https.onRequest(async (request, response) => {
  const tagId = request.query.tagId;

  if (!tagId) {
    return response.send("No tagId specified as query parameter");
  }

  const usersRef = firestore.collection("users");
  const userRef = usersRef.doc(tagId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    userRef.delete();
    return response.send("Logging out: " + tagId);
  } else {
    userRef.set({
      timestamp: new Date(),
      notes: "",
    });
    return response.send("Logging in: " + tagId);
  }
});

exports.clearSignIns = functions.pubsub
  .schedule("30 20 * * *")
  .timeZone("America/New_York") // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {
    console.log("This will be run every day at 8:05 PM Eastern!");
    const querySnapshot = await firestore.collection("users").get();
    await Promise.all(
      querySnapshot.docs.map((d) =>
        firestore.collection("users").doc(d.id).delete()
      )
    );
    return;
  });
