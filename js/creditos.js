// file: C:\Users\javih\OneDrive\Documentos\DemoOptica\js\creditos.js
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

// Actualizar estadísticas de créditos
function updateStats() {
    const creditos = JSON.parse(localStorage.getItem('creditos')) || [];
    
    const totalPendiente = creditos
        .filter(c => c.estado === 'pendiente')
        .reduce((sum, c) => sum + c.monto, 0);
    
    const totalPagado = creditos
        .filter(c => c.estado === 'pagado')
        .reduce((sum, c) => sum + c.monto, 0);
    
    const clientesUnicos = new Set(creditos.map(c => c.cliente)).size;
    
    document.getElementById('totalPendiente').textContent = `$${totalPendiente.toFixed(2)}`;
    document.getElementById('totalPagado').textContent = `$${totalPagado.toFixed(2)}`;
    document.getElementById('clientesCredito').textContent = clientesUnicos;
}

// Cargar créditos
function loadCreditos() {
    const creditos = JSON.parse(localStorage.getItem('creditos')) || [];
    const searchTerm = document.getElementById('searchCredito').value;
    const filtroEstado = document.getElementById('filtroEstado').value;
    
    let filteredCreditos = creditos;
    
    // Filtrar por búsqueda
    if (searchTerm) {
        filteredCreditos = filteredCreditos.filter(c => 
            c.cliente.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Filtrar por estado
    if (filtroEstado !== 'todos') {
        filteredCreditos = filteredCreditos.filter(c => c.estado === filtroEstado);
    }
    
    // Ordenar por fecha descendente
    filteredCreditos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    const tbody = document.getElementById('creditosList');
    
    if (filteredCreditos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay créditos registrados</td></tr>';
        return;
    }
    
    let html = '';
    filteredCreditos.forEach(credito => {
        const estadoClass = credito.estado === 'pendiente' ? 'estado-pendiente' : 'estado-pagado';
        html += `
            <tr>
                <td>${credito.id}</td>
                <td>${credito.cliente}</td>
                <td>${credito.fecha}</td>
                <td>$${credito.monto.toFixed(2)}</td>
                <td>
                    <span class="${estadoClass}" style="padding: 5px 10px; border-radius: 5px; background: ${credito.estado === 'pendiente' ? '#fed7d7' : '#c6f6d5'}; color: ${credito.estado === 'pendiente' ? '#c53030' : '#22543d'}">
                        ${credito.estado === 'pendiente' ? 'Pendiente' : 'Pagado'}
                    </span>
                </td>
                <td>
                    ${credito.estado === 'pendiente' ? 
                        `<button onclick="marcarComoPagado(${credito.id})" class="btn-secondary" style="padding: 5px 10px;">Marcar Pagado</button>` : 
                        '<span>Pagado</span>'
                    }
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Marcar crédito como pagado
window.marcarComoPagado = function(id) {
    if (confirm('¿Marcar este crédito como pagado?')) {
        let creditos = JSON.parse(localStorage.getItem('creditos')) || [];
        creditos = creditos.map(c => {
            if (c.id === id) {
                c.estado = 'pagado';
            }
            return c;
        });
        localStorage.setItem('creditos', JSON.stringify(creditos));
        updateStats();
        loadCreditos();
    }
}

// Event listeners
document.getElementById('searchCredito').addEventListener('keyup', loadCreditos);
document.getElementById('filtroEstado').addEventListener('change', loadCreditos);

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
    updateStats();
    loadCreditos();
});