const jwtToken = localStorage.getItem("jwtToken");
const usernameDisplay = document.getElementById("username");
const navContainer = document.getElementById("navContainer");
const navButtons = document.getElementById("navButtons");

if (jwtToken) {
    // User is logged in
    const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]));
    const username = decodedToken.username;
    usernameDisplay.textContent = username;

    // Show logout button
    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.id = "logout";
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('jwtToken');
        window.location.href = '/';
    });
    navButtons.appendChild(logoutButton);
} else {
    // User is not logged in

    // Show login button
    const loginButton = document.createElement("button");
    loginButton.textContent = "Login";
    loginButton.id = "login";
    loginButton.addEventListener('click', function () {
        window.location.href = '/login';
    });
    navButtons.appendChild(loginButton);

    // Show register button
    const registerButton = document.createElement("button");
    registerButton.textContent = "Register";
    registerButton.id = "register";
    registerButton.addEventListener('click', function () {
        window.location.href = '/register';
    });
    navButtons.appendChild(registerButton);

    usernameDisplay.textContent = "Guest";
}

// Add a class to center the button group
navContainer.classList.add("centered");
