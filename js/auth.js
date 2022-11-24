// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { getFirestore, doc, collection, addDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";
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
export { app, db, auth, analytics, userDoc, onAuthStateChanged, signOut };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics();
var user;
// setup firebase authentication
onAuthStateChanged(auth, (user) => {
  if (user) {
    /**  VERIFY  **/
    $('[data-auth-role="email"]').text(user.email);
    /**  AUTH  **/
    if (user.emailVerified) {
      if (window.location.pathname != "/dashboard/") {
        window.location.href = "/dashboard";
      }
    } else if (window.location.pathname != "/dashboard/verify.html") {
      new Toast("Please verify your email address to access the dashboard", "default", 1000, "/img/icon/toast/error-icon.svg", "/dashboard/verify.html");
    } else {
      /**  VERIFY  **/
      sendEmailVerification(user, { url: "https://kosumigo.github.io/dashboard" })
        .then(() => {
          $('[data-auth-role="verify-text"').text("Email instructions sent");
          new Toast("Verification email sent", "default", 3000, "/img/icon/toast/success-icon.svg");
        })
        .catch((error) => {
          new ErrorToast("Could not send verification email", cleanError(error), 5000);
        });
    }
  } else if (window.location.pathname != "/dashboard/login.html" && window.location.pathname != "/dashboard/signup.html" && window.location.pathname != "/dashboard/forgot-password.html" && window.location.pathname != "/dashboard/reset.html") {
    new Toast("Sorry, you must be logged in to access this page", "default", 2000, "/img/icon/toast/error-icon.svg", "./login.html");
  }
});

/**  USER DATA  **/
function userDoc() {
  return getDoc(doc(db, "users", user.uid));
}
/**  AUTH UTIL  **/
function cleanError(error) {
  switch (error.code) {
    case "auth/invalid-email":
      return "Invalid email";
    case "auth/user-disabled":
      return "User disabled";
    case "auth/user-not-found":
      return "User not found";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "Email already in use";
    case "auth/weak-password":
      return "Password is too weak";
    case "auth/operation-not-allowed":
      return "Operation not allowed";
    case "auth/too-many-requests":
      return "Too many requests";
    case "auth/invalid-credential":
      return "Invalid credential";
    case "auth/invalid-verification-code":
      return "Invalid verification code";
    case "auth/invalid-verification-id":
      return "Invalid verification ID";
    case "auth/missing-verification-code":
      return "Missing verification code";
    case "auth/missing-verification-id":
      return "Missing verification ID";
    case "auth/credential-already-in-use":
      return "Credential already in use";
    case "auth/missing-email":
      return "Email is missing";
    case "auth/missing-password":
      return "Password is missing";
    default:
      return error.message.replace("Error ", "");
  }
}
/**  SIGNUP  **/
$('[data-auth-role="agree-to-terms"]').change(function () {
  if ($(this).prop("checked")) {
    $('[data-auth-role="create-account"]').removeClass("disabled");
  } else {
    $('[data-auth-role="create-account"]').addClass("disabled");
  }
});
$('[data-auth-role="create-account"').click(function () {
  if ($(this).hasClass("disabled")) {
    new Toast("You must agree to the terms and conditions to create an account", "default", 5000, "/img/icon/toast/warning-icon.svg", "");
  } else {
    let email = $('[data-auth-role="email-input"]').val(),
      password = $('[data-auth-role="password-input"]').val();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        user = userCredential.user;
        // create user document in firestore keyed by uid with name
        setDoc(
          doc(db, "users", user.uid),
          {
            name: $('[data-auth-role="name"]').val(),
            email: email,
            uid: user.uid,
            created: new Date().getTime(),
          },
          { merge: true }
        )
          .then(() => {
            window.location = "/dashboard/verify.html";
          })
          .catch((error) => {
            new ErrorToast("Error creating user document", cleanError(error), 5000);
          });
      })
      .catch((error) => {
        new ErrorToast("Error creating account", cleanError(error), 5000);
      });
  }
});

/**  LOGIN  **/
$('[data-auth-role="login"]').click(function () {
  let email = $('[data-auth-role="email-input"]').val(),
    password = $('[data-auth-role="password-input"]').val();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      user = userCredential.user;
      window.location = "./index.html";
    })
    .catch((error) => {
      new ErrorToast("Error logging in", cleanError(error), 5000);
    });
});

/**  AUTH PAGES  **/
$("[data-auth-role='logoutprompt']").click(function () {
  new Popup("Are you sure you want to sign out?", "default", 10000, "/img/icon/toast/info-icon.svg", [
    ["removePopup()", "Cancel", "secondary-action fullborder"],
    ["removePopup()", "Yes", "primary-action data-auth-logout"],
  ]);
});
$(document.body).on("click", "[data-auth-role='logout'], .data-auth-logout", function () {
  signOut(auth);
});
/**  PASSWORD RESET PAGES  **/
$("[data-auth-role='to-forgot-password']").click(function () {
  window.location.href = "/dashboard/forgot-password.html?reset-email=" + $('[data-auth-role="email-input"]').val();
});
$("[data-auth-role='forgot-password']").click(function () {
  let email = $('[data-auth-role="email-input"]').val();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // fill email into success page
      $('[data-auth-role="reset-email"]').text(email);
      // toggle to success contents
      $('[data-auth-role="forgot-password-part"]').toggle();
      new Toast("Password reset email sent", "default", 3000, "/img/icon/toast/success-icon.svg", "");
    })
    .catch((error) => {
      new ErrorToast("Error sending password reset email", cleanError(error), 5000);
    });
});
if (params.has("reset-email")) {
  $('[data-auth-role="email-input"], [data-auth-role="reset-src-email"]').val(params.get("reset-email"));
}

/**  CHOOSE NEW PASSWORD (reset.html)  **/

if (window.location.pathname == "/dashboard/reset.html") {
  if (params.has("oobCode")) {
    let oobCode = params.get("oobCode");
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        $('[data-auth-role="reset-email"]').text(email);
        $('[data-auth-role="reset-password"]').click(function () {
          //Must contain upper and lowercase letters, numbers, and symbols
          let password = $('[data-auth-role="password-input"]').val(),
            confirm_password = $('[data-auth-role="confirm-password-input"]').val();
          if (password == confirm_password) {
            if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)) {
              confirmPasswordReset(auth, oobCode, password)
                .then(() => {
                  window.location.href = "/dashboard/login.html";
                })
                .catch((error) => {
                  new ErrorToast("Error resetting password", cleanError(error), 5000);
                });
            } else {
              new ErrorToast("Error resetting password", "Password must be at least 8 characters, contain upper and lowercase letters, numbers, and symbols", 5000);
            }
          } else {
            new ErrorToast("Error resetting password", "Passwords do not match", 5000);
          }
        });
      })
      .catch((error) => {
        new ErrorToast("Error verifying password reset code", cleanError(error), 5000);
      });
  } else {
    new Toast("Invalid password reset code. Returning to login", "default", 5000, "/img/icon/toast/warning-icon.svg", "/dashboard/login.html");
  }
}
