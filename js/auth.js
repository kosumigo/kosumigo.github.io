// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9HsjfAhwcTsRgoO65nUy0dAGOnBv1he4",
  authDomain: "kosumigo.firebaseapp.com",
  projectId: "kosumigo",
  storageBucket: "kosumigo.appspot.com",
  messagingSenderId: "837493583764",
  appId: "1:837493583764:web:34da4cd5541b3bae512981",
  measurementId: "G-WRXBCFQ1SH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// setup firebase authentication
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // var uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
    new Toast("Sorry, you must be logged in to access the dashboard", "default", 5000, "/img/icon/toast/error-icon.svg", "./login.html");
  }
});
