document.getElementById("login-submit-button").addEventListener("click", async function () {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Check whether the username and password exist
    if (username === "" || password === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill in both username and password!'
        })
        return;
    }

    // Send the login request to the server
    await fetch("/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
        },
        body: JSON.stringify({ username: username, password: password }),
    }).then(async (response) => {
        if (response.status === 200) {
            const responseData = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'You have been logged in!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Store the JWT token securely (e.g., in localStorage or cookies)
                    localStorage.setItem('jwtToken', responseData.token);

                    // Redirect or navigate to the desired page
                    window.location.href = "/";
                }
            });
        } else {
            const errorText = await response.text();
            Swal.fire({
                icon: 'error',
                title: 'Login failed.',
                text: errorText,
            }).then((result) => {
                // Redirect or navigate to the desired page
                window.location.href = "/";
            });
        }
    }).catch((error) => {
        console.error(`Error during the login process: ${error.message}`);
        Swal.fire({
            icon: 'error',
            title: 'Login failed.',
            text: error.message,
        });
    });
});
