document.getElementById("registration-submit-button").addEventListener("click", function() {

    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let passwordConfirm = document.getElementById('password-confirm').value;

    // Check if everything is filled
    if (username === "" || email === "" || password === "" || passwordConfirm === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill in all the fields!',
        })
        return;
    }

    // Check if the email is valid via regex
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a valid email!',
        })
        return;
    }

    // Check if the passwords match
    if (password !== passwordConfirm) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Passwords do not match!',
        })
        return;
    }

    // Send the form to /register
    // If successful, 201 is returned
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
        },
        body: JSON.stringify({username: username, email: email, password: password}),
    }).then(async (response) => {
        if (response.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                html: `Welcome <b>${username}</b>, You have been registered!`,
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/';
                }
                return;
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
    })
});