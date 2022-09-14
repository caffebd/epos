

const firebaseConfig = {
  apiKey: "AIzaSyCzmhLrfYEZ-QsshwVxGy2BBCvzDh2kBbQ",
  authDomain: "caffe-epos.firebaseapp.com",
  projectId: "caffe-epos",
  storageBucket: "caffe-epos.appspot.com",
  messagingSenderId: "737228991857",
  appId: "1:737228991857:web:589cb9aca88ec01cbd5ad0",
  measurementId: "G-377FEBWZH4",
};

const firebaseApp = firebase.initializeApp({
  ...firebaseConfig,
  projectId: firebaseConfig.projectId,
});

const auth = firebaseApp.auth();

function login() {
  // Get all our input fields
  email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    


  // location.href = "/epos.html";

  // return

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert("Email or Password not valid");
    return;
    // Don't continue running the code
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .then(function () {
      // Declare user variable
      user = auth.currentUser;

    localStorage.setItem("auth", "true");
    

      location.href = "/epos.html";

      // Add this user to Firebase Database
      // var database_ref = database.ref();

      // // Create User data
      // var user_data = {
      //   last_login: Date.now(),
      // };

      // // Push to Firebase Database
      // database_ref.child("users/" + user.uid).update(user_data);

      // // DOne
      // alert("User Logged In!!");
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code;
      var error_message = error.message;

      alert(error_message);
    });
}

// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) {
    // Email is good
    return true;
  } else {
    // Email is not good
    return false;
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false;
  } else {
    return true;
  }
}
