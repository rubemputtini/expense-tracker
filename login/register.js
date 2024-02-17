document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    if (localStorage.getItem(newUsername)) {
        alert("Usuário já existe! Por favor, escolha outro nome de usuário.");
        return;
    }

    const newUser = {
        username: newUsername,
        password: newPassword,
    };

    localStorage.setItem(newUsername, JSON.stringify(newUser));

    alert('Conta criada com sucesso! Você será redirecionado para a página principal.');

    window.location.href = '../app/app.html';
});
