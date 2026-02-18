// file: C:\Users\javih\OneDrive\Documentos\DemoOptica\js\login.js
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Credenciales demo
    if (username === 'admin' && password === 'admin123') {
        // Guardar sesión en localStorage
        localStorage.setItem('user', JSON.stringify({
            username: username,
            nombre: 'Administrador',
            loggedIn: true,
            loginTime: new Date().toISOString()
        }));
        
        // Redirigir al dashboard
        window.location.href = 'pages/dashboard.html';
    } else {
        alert('Credenciales incorrectas. Usuario: admin, Contraseña: admin123');
    }
});