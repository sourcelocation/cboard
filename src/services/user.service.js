export const userService = {
    login,
    logout
};

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${window.btoa(`${email}:${password}`)}` },
        body: JSON.stringify({ email, password })
    };

    return fetch(`http://127.0.0.1:8080/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            if (user) {
                user.authdata = window.btoa(email + ':' + password);
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
}

function logout() {
    localStorage.removeItem('user');
}

// function getAll() {
//     const requestOptions = {
//         method: 'GET',
//         headers: authHeader()
//     };

//     return fetch(`/users`, requestOptions).then(handleResponse);
// }

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}