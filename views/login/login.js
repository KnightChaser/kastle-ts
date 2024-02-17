document.getElementById("login-submit-button").addEventListener("click", function() {
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
    // If successful, 200 is returned
    fetch("/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: username, password: password}),
    }).then(async (response) => {
        if (response.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'You have been logged in!'
            }).then((result) => {
                // JWT Token or something else?
                if (result.isConfirmed) {
                    window.location.href = '/';
                }
            })
        } else {
            const errorText = await response.text();
            Swal.fire({
                icon: 'error',
                title: 'Registration failed.',
                text: errorText,
            })
        }
    }).catch((error) => {
        throw new Error(`Error during the registration process: ${error}`);
    });
});