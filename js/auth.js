// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { getFirestore, doc, collection, addDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js";
import { getAuth, updateProfile, applyActionCode, signOut, deleteUser, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset, setPersistence, browserSessionPersistence, inMemoryPersistence } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";
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

// function for setting persistence
function persistencePromise(is_persist) {
  return new Promise((resolve, reject) => {
    setPersistence(auth, is_persist ? inMemoryPersistence : browserSessionPersistence)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// setup firebase authentication
$('[data-auth-role="params-email"]').text(params.get("email"));
onAuthStateChanged(auth, (user) => {
  if (user) {
    /**  AUTH  **/
    $('[data-auth-role="email"]').text(user.email);
    if (!params.has("email")) {
      $('[data-auth-role="params-email"]').text(user.email);
    }
    if (user.emailVerified) {
      if (window.location.pathname != "/dashboard/" && window.location.pathname != "/dashboard/reset.html") {
        window.location.href = "/dashboard";
      }
    } else if (window.location.pathname != "/dashboard/verify.html" && window.location.pathname != "/dashboard/signup.html" && window.location.pathname != "/dashboard/verified.html") {
      new Toast("Please verify your email address to access this page", "default", 1000, "/img/icon/toast/error-icon.svg", "/dashboard/verify.html");
    } else {
      /**  VERIFY  **/
      // wait for send button click
      $("[data-auth-role='send-verification']").click(function () {
        sendEmailVerification(user, { url: "https://kosumigo.github.io/dashboard/" })
          .then(() => {
            $('[data-auth-role="verify-part"').toggle();
            new Toast("Verification email sent", "default", 3000, "/img/icon/toast/success-icon.svg");
          })
          .catch((error) => {
            new ErrorToast("Could not send verification email", cleanError(error), 5000);
          });
      });
    }
  } else if (window.location.pathname != "/dashboard/login.html" && window.location.pathname != "/dashboard/signup.html" && window.location.pathname != "/dashboard/forgot-password.html" && window.location.pathname != "/dashboard/reset.html" && window.location.pathname != "/dashboard/verify.html" && window.location.pathname != "/dashboard/verified.html") {
    new Toast("Sorry, you must be logged in to access this page", "default", 2000, "/img/icon/toast/error-icon.svg", "./login.html");
  } else if (window.location.pathname == "/dashboard/verify.html") {
    setTimeout(function () {
      window.location.href = "/dashboard";
    }, 2000);
  }
});

/**  USER DATA  **/
function userDoc() {
  return getDoc(doc(db, "users", user.uid));
}
/**  AUTH UTIL  **/
const cleanErrors = {
  "auth/invalid-email": "Invalid email",
  "auth/user-disabled": "User disabled",
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Incorrect password",
  "auth/email-already-in-use": "Email already in use",
  "auth/weak-password": "Password is too weak",
  "auth/operation-not-allowed": "Operation not allowed",
  "auth/too-many-requests": "Too many requests. Please wait before trying again",
  "auth/invalid-credential": "Invalid credential",
  "auth/invalid-verification-code": "Invalid verification code",
  "auth/invalid-verification-id": "Invalid verification ID",
  "auth/missing-verification-code": "Missing verification code",
  "auth/missing-verification-id": "Missing verification ID",
  "auth/credential-already-in-use": "Credential already in use",
  "auth/missing-email": "Email is missing",
  "auth/missing-password": "Password is missing",
  "auth/invalid-action-code": "Invalid action code",
};
function cleanError(error) {
  if (cleanErrors[error.code]) {
    return cleanErrors[error.code];
  }
  return error.message.replace("Error ", "");
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
  let email = $('[data-auth-role="email-input"]').val(),
    password = $('[data-auth-role="password-input"]').val(),
    name = $('[data-auth-role="name"]').val();
  if ($(this).hasClass("disabled")) {
    new Toast("You must agree to the terms and conditions to create an account", "default", 5000, "/img/icon/toast/warning-icon.svg", "");
  } else if (email && password && name) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        user = userCredential.user;
        // create user document in firestore keyed by uid with name
        setDoc(
          doc(db, "users", user.uid),
          {
            name: name,
            email: email,
            uid: user.uid,
            created: new Date().getTime(),
          },
          { merge: true }
        )
          .then(() => {
            // set user display name
            updateProfile(user, {
              displayName: $('[data-auth-role="name"]').val(),
            }).then(() => {
              window.location = "/dashboard/verify.html?email=" + encodeURIComponent(email);
            });
          })
          .catch((error) => {
            new ErrorToast("Error creating user document", cleanError(error), 5000);
          });
      })
      .catch((error) => {
        new ErrorToast("Error creating account", cleanError(error), 5000);
      });
  } else {
    new Toast("Please fill in all fields", "default", 5000, "/img/icon/toast/warning-icon.svg", "");
  }
});

/**  LOGIN  **/
$('[data-auth-role="login"]').click(function () {
  let email = $('[data-auth-role="email-input"]').val(),
    password = $('[data-auth-role="password-input"]').val();
  if (email && password) {
    signInWithEmailAndPassword(auth, email, password, { remember: $("[data-auth-role='remember-user']").is(":checked") ? null : "sessionOnly" })
      .then((userCredential) => {
        user = userCredential.user;
        window.location = "./index.html";
      })
      .catch((error) => {
        new ErrorToast("Error logging in", cleanError(error), 5000);
      });
  } else {
    new Toast("Please fill in all fields before logging in", "default", 5000, "/img/icon/toast/warning-icon.svg", "");
  }
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
/**  DASH LINKS  **/
$("[data-auth-role='to-dashboard']").click(function () {
  window.location.href = "/dashboard/";
});
/**  PASSWORD RESET PAGES  **/
$("[data-auth-role='to-forgot-password']").click(function () {
  window.location.href = "/dashboard/forgot-password.html?reset-email=" + encodeURIComponent($('[data-auth-role="email-input"]').val());
});
$("[data-auth-role='forgot-password']").click(function () {
  let email = $('[data-auth-role="email-input"]').val();
  //check if email is valid first
  if (email && email.includes("@")) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // fill email into success page
        $('[data-auth-role="forgot-email"]').text(email);
        // toggle to success contents
        $('[data-auth-role="forgot-password-part"]').toggle();
        new Toast("Password reset email sent", "default", 3000, "/img/icon/toast/success-icon.svg", "");
      })
      .catch((error) => {
        new ErrorToast("Error sending password reset email", cleanError(error), 5000);
      });
  } else {
    new Toast("Please enter a valid email address", "default", 5000, "/img/icon/toast/warning-icon.svg", "");
  }
});
if (params.has("reset-email")) {
  $('[data-auth-role="email-input"], [data-auth-role="reset-src-email"]').val(params.get("reset-email"));
}

/**  CHOOSE NEW PASSWORD (reset.html)  **/

if (window.location.pathname == "/dashboard/reset.html") {
  if (params.has("oobCode") && params.has("mode") && params.get("mode") == "resetPassword") {
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
                  //login with username and password
                  signInWithEmailAndPassword(auth, email, password).then(() => {
                    new Toast("Password reset successful. Signed in", "default", 3000, "/img/icon/toast/success-icon.svg", "/dashboard/");
                  });
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
        setTimeout(() => {
          window.location.href = "/dashboard/login.html";
        }, 5000);
      });
  } else {
    new Toast("Invalid password reset code. Returning to login", "default", 5000, "/img/icon/toast/warning-icon.svg", "/dashboard/login.html");
  }
}

/**  VERIFY EMAIL FROM OOBCODE (verified.html)  **/
if (window.location.pathname == "/dashboard/verified.html") {
  if (params.has("oobCode") && params.has("mode") && params.get("mode") == "verifyEmail") {
    let oobCode = params.get("oobCode");
    applyActionCode(auth, oobCode)
      .then(() => {
        $('[data-auth-role="verified-part"]').toggle();
      })
      .catch((error) => {
        new ErrorToast("Error verifying email", cleanError(error), 5000);
      });
  } else {
    new Toast("Invalid email verification code. Returning to login", "default", 5000, "/img/icon/toast/warning-icon.svg", "/dashboard/login.html");
  }
}

/**  CHANGE EMAIL  **/
$("[data-auth-role='change-email']").click(function () {
  // delete account and redirect to login
  deleteUser(auth.currentUser)
    .then(() => {
      new Toast("Deleted account instance, returning to signup", "default", 1500, "/img/icon/toast/success-icon.svg", "/dashboard/signup.html");
    })
    .catch((error) => {
      new ErrorToast("Error deleting account with current email, signing out instead", cleanError(error), 2000, "/dashboard/signup.html");
      setTimeout(() => {
        signOut(auth);
      }, 2000);
    });
});

//interpret any enter keypresses as a click on the submit button
$("[data-auth-role='email-input'], [data-auth-role='password-input'], [data-auth-role='confirm-password-input']").on("keypress", function (e) {
  if (e.which == 13) {
    e.preventDefault();
    $(this).closest("form, #onboard-container").find("[type='submit'], input[type='button']").click();
  }
});

//tool to validate [data-role="email"] inputs for correctness and correspondingly update the closest ".input-pair" with a "valid" or "invalid" class
