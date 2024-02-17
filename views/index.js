const jwtToken = localStorage.getItem('jwtToken');
const usernameDisplay = document.getElementById('username');

if (jwtToken) {
    const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]));
    const username = decodedToken.username;
    usernameDisplay.textContent = username;
} else {
    usernameDisplay.textContent = 'Guest';
}