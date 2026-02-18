// file: C:\Users\javih\OneDrive\Documentos\DemoOptica\js\historial.js
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

// Mostrar/ocultar formulario
window.showNewHistorialForm = function() {
    document.getElementById('nuevoHistorialForm').style.display = 'block';
    // Establecer fecha actual por defecto
    document.getElementById('fechaConsulta').value = new Date().toISOString().split('T')[0];
}

window.hideNewHistorialForm = function() {
    document.getElementById('nuevoHistorialForm').style.display = 'none';
    document.getElementById('historialForm').reset();
}

// Cargar historial clínico
function loadHistorial() {
    const historial = JSON.parse(localStorage.getItem('historialClinico')) || [];
    const searchTerm = document.getElementById('searchHistorial').value;
    
    let filteredHistorial = historial;
    if (searchTerm) {
        filteredHistorial = historial.filter(h => 
            h.paciente.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Ordenar por fecha descendente
    filteredHistorial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    const tbody = document.getElementById('historialList');
    
    if (filteredHistorial.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay registros clínicos</td></tr>';
        return;
    }
    
    let html = '';
    filteredHistorial.forEach(registro => {
        html += `
            <tr>
                <td>${registro.id}</td>
                <td><strong>${registro.paciente}</strong></td>
                <td>${registro.fecha}</td>
                <td>${registro.od || 'N/A'}</td>
                <td>${registro.oi || 'N/A'}</td>
                <td>${registro.diagnostico || 'N/A'}</td>
                <td>
                    <button onclick="verDetalleHistorial(${registro.id})" class="btn-secondary" style="padding: 5px 10px;">Ver Detalle</button>
                    <button onclick="deleteHistorial(${registro.id})" class="btn-danger" style="padding: 5px 10px;">Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Ver detalle del historial
window.verDetalleHistorial = function(id) {
    const historial = JSON.parse(localStorage.getItem('historialClinico')) || [];
    const registro = historial.find(h => h.id === id);
    
    if (registro) {
        alert(`
            HISTORIAL CLÍNICO COMPLETO
            Paciente: ${registro.paciente}
            Fecha: ${registro.fecha}
            
            EXAMEN VISUAL:
            Ojo Derecho (OD): ${registro.od || 'No especificado'}
            Ojo Izquierdo (OI): ${registro.oi || 'No especificado'}
            
            Diagnóstico: ${registro.diagnostico || 'No especificado'}
            
            Observaciones: ${registro.observaciones || 'Sin observaciones'}
        `);
    }
}

// Eliminar registro
window.deleteHistorial = function(id) {
    if (confirm('¿Está seguro de eliminar este registro clínico?')) {
        let historial = JSON.parse(localStorage.getItem('historialClinico')) || [];
        historial = historial.filter(h => h.id !== id);
        localStorage.setItem('historialClinico', JSON.stringify(historial));
        loadHistorial();
    }
}

// Generar nuevo ID
function generateNewHistorialId() {
    const historial = JSON.parse(localStorage.getItem('historialClinico')) || [];
    if (historial.length === 0) return 1;
    return Math.max(...historial.map(h => h.id)) + 1;
}

// Guardar nuevo registro
document.getElementById('historialForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevoRegistro = {
        id: generateNewHistorialId(),
        paciente: document.getElementById('paciente').value,
        fecha: document.getElementById('fechaConsulta').value,
        od: document.getElementById('od').value,
        oi: document.getElementById('oi').value,
        diagnostico: document.getElementById('diagnostico').value,
        observaciones: document.getElementById('observaciones').value
    };
    
    let historial = JSON.parse(localStorage.getItem('historialClinico')) || [];
    historial.push(nuevoRegistro);
    localStorage.setItem('historialClinico', JSON.stringify(historial));
    
    alert('Registro clínico guardado exitosamente');
    hideNewHistorialForm();
    loadHistorial();
});

// Búsqueda en tiempo real
document.getElementById('searchHistorial').addEventListener('keyup', loadHistorial);

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
    loadHistorial();
});