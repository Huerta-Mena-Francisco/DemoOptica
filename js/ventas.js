// file: C:\Users\javih\OneDrive\Documentos\DemoOptica\js\ventas.js
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

// Cargar ventas
function loadVentas(searchTerm = '') {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    const tbody = document.getElementById('ventasList');
    
    let filteredVentas = ventas;
    if (searchTerm) {
        filteredVentas = ventas.filter(v => 
            v.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.cliente.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Ordenar por fecha descendente
    filteredVentas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    if (filteredVentas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay ventas registradas</td></tr>';
        return;
    }
    
    let html = '';
    filteredVentas.forEach(venta => {
        html += `
            <tr>
                <td>${venta.id}</td>
                <td>${venta.fecha}</td>
                <td>${venta.producto}</td>
                <td>${venta.cliente}</td>
                <td>${venta.cantidad}</td>
                <td>$${venta.total.toFixed(2)}</td>
                <td>
                    <button onclick="verDetalleVenta(${venta.id})" class="btn-secondary" style="padding: 5px 10px;">Ver Detalle</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Ver detalle de venta
window.verDetalleVenta = function(id) {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    const venta = ventas.find(v => v.id === id);
    
    if (venta) {
        alert(`
            DETALLE DE VENTA
            ID: ${venta.id}
            Fecha: ${venta.fecha}
            Producto: ${venta.producto}
            Cliente: ${venta.cliente}
            Cantidad: ${venta.cantidad}
            Total: $${venta.total}
        `);
    }
}

// Búsqueda en tiempo real
document.getElementById('searchVenta').addEventListener('keyup', function(e) {
    loadVentas(e.target.value);
});

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
    loadVentas();
});