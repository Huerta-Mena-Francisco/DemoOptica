// file: C:\Users\javih\OneDrive\Documentos\DemoOptica\js\productos.js
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

// Cargar productos
function loadProductos(searchTerm = '') {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const tbody = document.getElementById('productosList');
    
    let filteredProductos = productos;
    if (searchTerm) {
        filteredProductos = productos.filter(p => 
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.tipo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filteredProductos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay productos registrados</td></tr>';
        return;
    }
    
    let html = '';
    filteredProductos.forEach(producto => {
        html += `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${getTipoLabel(producto.tipo)}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.stock}</td>
                <td>
                    <button onclick="editProducto(${producto.id})" class="btn-secondary" style="padding: 5px 10px; margin-right: 5px;">Editar</button>
                    <button onclick="deleteProducto(${producto.id})" class="btn-danger" style="padding: 5px 10px;">Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Obtener etiqueta de tipo
function getTipoLabel(tipo) {
    const tipos = {
        'sol': 'Lentes de Sol',
        'armazon': 'Lentes de Armazón',
        'contacto': 'Lentes de Contacto',
        'accesorio': 'Accesorios'
    };
    return tipos[tipo] || tipo;
}

// Editar producto
window.editProducto = function(id) {
    // Por ahora solo mostramos alert, luego implementaremos edición
    alert(`Función de editar para producto ${id} - Disponible en próxima versión`);
}

// Eliminar producto
window.deleteProducto = function(id) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productos));
        loadProductos();
    }
}

// Búsqueda en tiempo real
document.getElementById('searchProducto').addEventListener('keyup', function(e) {
    loadProductos(e.target.value);
});

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
    loadProductos();
});