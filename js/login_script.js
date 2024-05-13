// Declare the username and password
var validUsername = "KelompokB4";
var validPassword = "12341234";

function loginSuccess() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Perform login validation
  if (username === validUsername && password === validPassword) {
    // Redirect to the desired section upon successful login
    window.location.href = "home.html";
    return false; // Prevent default form submission
  } else {
    // Display an alert for invalid credentials
    alert("EA SALAH\nInvalid username or password. Please try again.");
    return false; // Prevent default form submission
  }
}

function logout() {
  // Redirect to the desired page upon logout
  window.location.href = "index.html";
}
