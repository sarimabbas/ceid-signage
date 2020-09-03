import * as firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAfR6tjcCpAevxqerh5kt6PmLZ7AdIA92k",
  authDomain: "ceid-swiper.firebaseapp.com",
  databaseURL: "https://ceid-swiper.firebaseio.com",
  projectId: "ceid-swiper",
  storageBucket: "ceid-swiper.appspot.com",
  messagingSenderId: "543664375468",
  appId: "1:543664375468:web:b185333bf2e0d695324109",
};

const firebaseApp = firebase.initializeApp(config);

const db = firebaseApp.firestore();

export { db };
