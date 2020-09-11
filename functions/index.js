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
    });
    return response.send("Logging in: " + tagId);
  }
});
