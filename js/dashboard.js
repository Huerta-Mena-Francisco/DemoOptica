// file: C:\Users\javih\OneDrive\Documentos\DemoOptica\js\dashboard.js
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

// Inicializar datos de ejemplo si no existen
function initializeData() {
    if (!localStorage.getItem('productos')) {
        const productos = [
            { id: 1, nombre: 'Lentes de Sol Rayban', precio: 1500, stock: 10, tipo: 'sol' },
            { id: 2, nombre: 'Lentes de Armazón Oakley', precio: 2000, stock: 5, tipo: 'armazon' },
            { id: 3, nombre: 'Lentes de Contacto', precio: 800, stock: 20, tipo: 'contacto' },
            { id: 4, nombre: 'Lentes Progresivos', precio: 3500, stock: 3, tipo: 'armazon' },
            { id: 5, nombre: 'Lentes de Sol Carrera', precio: 1800, stock: 7, tipo: 'sol' }
        ];
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    if (!localStorage.getItem('ventas')) {
        const ventas = [
            { id: 1, fecha: '2024-01-15', producto: 'Lentes de Sol Rayban', cantidad: 1, total: 1500, cliente: 'Juan Pérez' },
            { id: 2, fecha: '2024-01-16', producto: 'Lentes de Armazón Oakley', cantidad: 1, total: 2000, cliente: 'María García' }
        ];
        localStorage.setItem('ventas', JSON.stringify(ventas));
    }

    if (!localStorage.getItem('creditos')) {
        const creditos = [
            { id: 1, cliente: 'Carlos López', monto: 3500, fecha: '2024-01-10', estado: 'pendiente' },
            { id: 2, cliente: 'Ana Martínez', monto: 1800, fecha: '2024-01-12', estado: 'pagado' }
        ];
        localStorage.setItem('creditos', JSON.stringify(creditos));
    }

    if (!localStorage.getItem('historialClinico')) {
        const historial = [
            { id: 1, paciente: 'Roberto Díaz', fecha: '2024-01-14', od: '-1.5', oi: '-1.75', diagnostico: 'Miopía' },
            { id: 2, paciente: 'Laura Sánchez', fecha: '2024-01-13', od: '+1.0', oi: '+1.25', diagnostico: 'Hipermetropía' }
        ];
        localStorage.setItem('historialClinico', JSON.stringify(historial));
    }
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

// Actualizar estadísticas
function updateStats() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    const creditos = JSON.parse(localStorage.getItem('creditos')) || [];
    const historial = JSON.parse(localStorage.getItem('historialClinico')) || [];

    document.getElementById('totalProductos').textContent = productos.length;
    
    // Ventas de hoy
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = ventas.filter(v => v.fecha === hoy).length;
    document.getElementById('ventasHoy').textContent = ventasHoy;
    
    document.getElementById('clientesCredito').textContent = creditos.length;
    document.getElementById('totalHistorias').textContent = historial.length;
}

// Mostrar últimos productos
function showLastProducts() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const ultimos = productos.slice(-3).reverse();
    
    let html = '<ul style="list-style: none;">';
    ultimos.forEach(p => {
        html += `<li style="padding: 5px 0; border-bottom: 1px solid #eee;">
            <strong>${p.nombre}</strong> - $${p.precio} (Stock: ${p.stock})
        </li>`;
    });
    html += '</ul>';
    
    document.getElementById('ultimosProductos').innerHTML = html;
}

// Mostrar últimas ventas
function showLastSales() {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    const ultimas = ventas.slice(-3).reverse();
    
    let html = '<ul style="list-style: none;">';
    ultimas.forEach(v => {
        html += `<li style="padding: 5px 0; border-bottom: 1px solid #eee;">
            <strong>${v.producto}</strong> - $${v.total}<br>
            <small>Cliente: ${v.cliente} | ${v.fecha}</small>
        </li>`;
    });
    html += '</ul>';
    
    document.getElementById('ultimasVentas').innerHTML = html;
}

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    updateUserInfo();
    updateStats();
    showLastProducts();
    showLastSales();
});