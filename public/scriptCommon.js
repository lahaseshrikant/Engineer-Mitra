
// Navbar functionality for mobile devices
window.menubarFunction = function () {
    console.log("Function called");

    var x = document.getElementById("menuButton");
    x.classList.toggle("change");

    var navbar = document.getElementById("navbar-mobile");
    var isNavbarResponsive = navbar.classList.contains("responsive");
    if (!isNavbarResponsive) {
        navbar.classList.add("responsive");
        document.addEventListener("click", closeNavbarOnClickOutside);
    } else {
        navbar.classList.remove("responsive");
        document.removeEventListener("click", closeNavbarOnClickOutside);
    }
};

function closeNavbarOnClickOutside(event) {
    var navbar = document.getElementById("navbar-mobile");
    var menuIcon = document.getElementById("menuButton");

    if (!navbar.contains(event.target) && event.target !== menuIcon) {
        navbar.className = "navbar-mobile";
        menuIcon.classList.toggle("change");
        document.removeEventListener("click", closeNavbarOnClickOutside);
    }
}

// Importing firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "./firebaseConfig.js"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
window.app = app;
const analytics = getAnalytics(app);
logEvent(analytics, 'notification_received');
const auth = getAuth();
window.auth = auth;

var loginLink = document.getElementById('login-link');
var loginLinkMobile = document.getElementById('m-login-link');
var logoutLink = document.getElementById('logout-link');
var logoutLinkMobile = document.getElementById('m-logout-link');
var signUpLink = document.getElementById('signup-link');
var signUpLinkMobile = document.getElementById('m-signup-link');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in.
        loginLink.innerHTML = "Profile";
        loginLinkMobile.innerHTML = `<i class="fa fa-user"> Profile<i>`;
        loginLink.href = "profile.html";
        loginLinkMobile.href = "profile.html";

        signUpLink.innerHTML = "Logout";
        signUpLinkMobile.innerHTML = `<i class="fa fa-sign-out"> Logout</i>`;
        signUpLink.href = "#";
        signUpLinkMobile.href = "#";
        signUpLink.id = "logout-link";
        signUpLinkMobile.id = "m-logout-link";
        signUpLink.addEventListener('click', function () {
            Logout();
        });
    } else {
        // No user is signed in.
        loginLink.href = "login.html";
        loginLinkMobile.href = "login.html";
    }
});

function Logout() {
    auth.signOut().then(function () {
        // Sign-out successful, redirect to login page
        window.location.href = "login.html";
    }).catch(function (error) {
        // An error happened during sign out
        console.error('Sign out error', error);
    });
}

if (logoutLink) {
    logoutLink.addEventListener('click', function () {
        Logout();
    });
}

if (logoutLinkMobile) {
    logoutLinkMobile.addEventListener('click', function () {
        Logout();
    });
}

setInterval(() => {
    if(document.getElementById('namskar').innerHTML=="Welcome"){
        document.getElementById('namskar').innerHTML = "नमस्कार";
    }
    else{
        document.getElementById('namskar').innerHTML = "Welcome";
    }
}, 2000);