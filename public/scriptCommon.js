window.menubarFunction = function() {
    console.log("Function called");
    var navbar = document.getElementById("navbar");
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
    var navbar = document.getElementById("navbar");
    var icon = document.getElementById("navbarButton");

    if (!navbar.contains(event.target) && event.target !== icon) {
        navbar.className = "navbar";
        document.removeEventListener("click", closeNavbarOnClickOutside);
    }
}

// Import the functions you need from the SDKs you need
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
const analytics = getAnalytics(app);
logEvent(analytics, 'notification_received');
const auth = getAuth();

window.onload = function () {
    var loginLink = document.getElementById('login-link');
    var userMenu = document.getElementById('user-menu');
    var logoutLink = document.getElementById('logout-link');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in.
            loginLink.style.display = 'none';
            userMenu.style.display = 'inline';
        } else {
            // No user is signed in.
            loginLink.style.display = 'inline';
            userMenu.style.display = 'none';
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
};