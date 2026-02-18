// file: C:\Users\javih\OneDrive\Documentos\DemoOptica\js\productos-create.js
// Verificar sesión
function checkSession() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = '../index.html';
        return null;
    }
    return JSON.parse(user);
}

// Cerrar sesión
window.logout = function() {
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

// Actualizar información del usuario
function updateUserInfo() {
    const user = checkSession();
    if (user) {
        document.getElementById('userInfo').innerHTML = `
            <span>Bienvenido, ${user.nombre}</span>
        `;
    }
}

// Generar nuevo ID
function generateNewId() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    if (productos.length === 0) return 1;
    return Math.max(...productos.map(p => p.id)) + 1;
}

// Guardar producto
document.getElementById('productoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevoProducto = {
        id: generateNewId(),
        nombre: document.getElementById('nombre').value,
        tipo: document.getElementById('tipo').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value)
    };
    
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productos));
    
    alert('Producto guardado exitosamente');
    window.location.href = 'productos.html';
});

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
});