const LOGIN_FORM = document.getElementById('login-form');
const USERNAME_INPUT = document.getElementById('username');
const PASSWORD_INPUT = document.getElementById('password');
const LOGIN_ERROR_MESSAGE = document.getElementById('login-error-message');

LOGIN_FORM.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = USERNAME_INPUT.value;
    const password = PASSWORD_INPUT.value;

    const user = JSON.parse(localStorage.getItem(username));

    if (user && user.password === password) {
        window.location.href = '../app/app.html';
    } else {
        LOGIN_ERROR_MESSAGE.textContent = 'Usuário ou senha incorretos.';
    }
});