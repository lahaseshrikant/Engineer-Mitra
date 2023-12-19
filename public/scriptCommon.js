function myFunction1() {
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
}

function closeNavbarOnClickOutside(event) {
    var navbar = document.getElementById("navbar");
    var icon = document.getElementById("navbarButton");

    if (!navbar.contains(event.target) && event.target !== icon) {
        navbar.className = "navbar";
        document.removeEventListener("click", closeNavbarOnClickOutside);
    }
}

window.onload = function () {
    var user = window.auth.currentUser;
    var loginLink = document.getElementById('login-link');
    var userMenu = document.getElementById('user-menu');

    if (user) {
        // User is logged in
        loginLink.style.display = 'none';
        userMenu.style.display = 'inline';
    } else {
        // User is logged out
        loginLink.style.display = 'inline';
        userMenu.style.display = 'none';
    }

    var logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        // Logout button functionality
        logoutButton.addEventListener('click', function () {
            window.auth().signOut().then(function () {
                // Sign-out successful, redirect to login page
                window.location.href = "login.html";
            }).catch(function (error) {
                // An error happened during sign out
                console.error('Sign out error', error);
            });
        });
    } else {
        console.error('Logout button not found');
    }
};