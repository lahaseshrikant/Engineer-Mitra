
// Navbar functionality for mobile devices
window.menubarFunction = function () {
    console.log("Function called");

    var x = document.getElementById("menuButton");
    var x = document.getElementById("menuButton1");
    x.classList.toggle("change");

    var navbar = document.getElementById("navbar-mobile");
    var navbar1 = document.getElementById("navbar-mobile1");
    var isNavbarResponsive = navbar.classList.contains("responsive");
    var isNavbar1Responsive = navbar1.classList.contains("responsive");
    if (!isNavbarResponsive) {
        navbar.classList.add("responsive");
        document.addEventListener("click", closeNavbarOnClickOutside);
    } else {
        navbar.classList.remove("responsive");
        document.removeEventListener("click", closeNavbarOnClickOutside);
    }

    if (!isNavbar1Responsive) {
        navbar1.classList.add("responsive");
        document.addEventListener("click", closeNavbarOnClickOutside);
    } else { 
        navbar1.classList.remove("responsive");
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

const firebaseConfig = {
    apiKey: "AIzaSyAvsKMRtnF0CY0RvNbG6_XoleZhJOs6Ub0",
    authDomain: "engineer-mitra.firebaseapp.com",
    databaseURL: "https://engineer-mitra-default-rtdb.firebaseio.com",
    projectId: "engineer-mitra",
    storageBucket: "engineer-mitra.appspot.com",
    messagingSenderId: "999063294330",
    appId: "1:999063294330:web:d7b8b673986f858e53c6c3",
    measurementId: "G-J2NB2EBPJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
window.app = app;
const analytics = getAnalytics(app);
logEvent(analytics, 'notification_received');
const auth = getAuth();
window.auth = auth;

var nav=document.getElementById('navbar');
var nav1=document.getElementById('navbar1');
var navm=document.getElementById('navbar-mobile');
var navm1=document.getElementById('navbar-mobile1');
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in.
        nav1.classList.add("show");
        navm1.classList.add("show");
    } else {
        nav.classList.add("show");
        navm.classList.add("show");
    }
});

if (logoutLink) {
    // Logout button functionality
    logoutLink.addEventListener('click', function () {
        auth.signOut().then(function () {
            // Sign-out successful, redirect to login page
            window.location.href = "login.html";
        }).catch(function (error) {
            // An error happened during sign out
            console.error('Sign out error', error);
        });
    });
} else {
    console.error('Logout link not found');
}
