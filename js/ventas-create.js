// file: C:\Users\javih\OneDrive\Documentos\DemoOptica\js\ventas-create.js
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

// Cargar productos en el select
function loadProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const select = document.getElementById('producto');
    
    productos.filter(p => p.stock > 0).forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.id;
        option.textContent = `${producto.nombre} - $${producto.precio} (Stock: ${producto.stock})`;
        option.dataset.precio = producto.precio;
        option.dataset.stock = producto.stock;
        option.dataset.nombre = producto.nombre;
        select.appendChild(option);
    });
}

// Actualizar precio y total cuando se selecciona producto
document.getElementById('producto').addEventListener('change', function() {
    const selected = this.options[this.selectedIndex];
    if (selected.value) {
        const precio = parseFloat(selected.dataset.precio);
        document.getElementById('precio').value = precio.toFixed(2);
        calcularTotal();
    } else {
        document.getElementById('precio').value = '';
        document.getElementById('total').value = '';
    }
});

// Actualizar total cuando cambia cantidad
document.getElementById('cantidad').addEventListener('input', calcularTotal);

function calcularTotal() {
    const precio = parseFloat(document.getElementById('precio').value) || 0;
    const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
    const total = precio * cantidad;
    document.getElementById('total').value = total.toFixed(2);
}

// Validar stock disponible
function validarStock(productoId, cantidad) {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const producto = productos.find(p => p.id === parseInt(productoId));
    return producto && producto.stock >= cantidad;
}

// Actualizar stock después de la venta
function actualizarStock(productoId, cantidad) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos = productos.map(p => {
        if (p.id === parseInt(productoId)) {
            p.stock -= cantidad;
        }
        return p;
    });
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Generar nuevo ID para venta
function generateNewVentaId() {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    if (ventas.length === 0) return 1;
    return Math.max(...ventas.map(v => v.id)) + 1;
}

// Guardar venta
document.getElementById('ventaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productoSelect = document.getElementById('producto');
    const selectedOption = productoSelect.options[productoSelect.selectedIndex];
    const productoId = productoSelect.value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const aCredito = document.getElementById('aCredito').checked;
    
    // Validar stock
    if (!validarStock(productoId, cantidad)) {
        alert('No hay suficiente stock disponible');
        return;
    }
    
    // Crear venta
    const nuevaVenta = {
        id: generateNewVentaId(),
        fecha: new Date().toISOString().split('T')[0],
        producto: selectedOption.dataset.nombre,
        productoId: parseInt(productoId),
        cantidad: cantidad,
        precio: parseFloat(document.getElementById('precio').value),
        total: parseFloat(document.getElementById('total').value),
        cliente: document.getElementById('cliente').value,
        tipo: aCredito ? 'credito' : 'contado'
    };
    
    // Guardar venta
    let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    ventas.push(nuevaVenta);
    localStorage.setItem('ventas', JSON.stringify(ventas));
    
    // Actualizar stock
    actualizarStock(productoId, cantidad);
    
    // Si es a crédito, crear registro en créditos
    if (aCredito) {
        let creditos = JSON.parse(localStorage.getItem('creditos')) || [];
        const nuevoCredito = {
            id: creditos.length + 1,
            cliente: nuevaVenta.cliente,
            monto: nuevaVenta.total,
            fecha: nuevaVenta.fecha,
            ventaId: nuevaVenta.id,
            estado: 'pendiente'
        };
        creditos.push(nuevoCredito);
        localStorage.setItem('creditos', JSON.stringify(creditos));
    }
    
    alert('Venta realizada exitosamente');
    window.location.href = 'ventas.html';
});

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
    loadProductos();
});