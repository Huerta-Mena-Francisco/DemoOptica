// file: C:\Users\javih\OneDrive\Documentos\DemoOptica\js\analytics.js
// Variables para los gráficos
let ventasChart, topProductosChart, tipoProductosChart, creditosChart;

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
            <span><i class="fas fa-user-circle"></i> ${user.nombre}</span>
        `;
    }
}

// Inicializar date range picker
function initDatePicker() {
    flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "Y-m-d",
        defaultDate: [getFirstDayOfMonth(), getToday()],
        onChange: function() {
            updateAnalytics();
        }
    });
}

// Obtener primer día del mes
function getFirstDayOfMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Obtener fecha actual
function getToday() {
    return new Date();
}

// Obtener fechas seleccionadas
function getSelectedDates() {
    const dateRange = document.getElementById('dateRange').value;
    if (!dateRange) {
        return {
            start: getFirstDayOfMonth(),
            end: getToday()
        };
    }
    
    const dates = dateRange.split(' to ');
    return {
        start: new Date(dates[0]),
        end: dates[1] ? new Date(dates[1]) : new Date(dates[0])
    };
}

// Calcular KPI y actualizar gráficos
function updateAnalytics() {
    const dates = getSelectedDates();
    
    // Obtener datos
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const creditos = JSON.parse(localStorage.getItem('creditos')) || [];
    
    // Filtrar ventas por rango de fechas
    const ventasFiltradas = ventas.filter(v => {
        const fechaVenta = new Date(v.fecha);
        return fechaVenta >= dates.start && fechaVenta <= dates.end;
    });
    
    // Calcular KPIs
    calculateKPIs(ventasFiltradas, ventas, productos, creditos);
    
    // Actualizar gráficos
    updateVentasChart(ventasFiltradas);
    updateTopProductosChart(ventasFiltradas);
    updateTipoProductosChart(ventasFiltradas, productos);
    updateCreditosChart(creditos);
}

// Calcular KPIs
function calculateKPIs(ventasFiltradas, ventasTotales, productos, creditos) {
    // Ventas totales en el período
    const totalVentas = ventasFiltradas.reduce((sum, v) => sum + v.total, 0);
    document.getElementById('totalVentas').textContent = `$${totalVentas.toFixed(2)}`;
    
    // Comparación con mes anterior
    const mesAnterior = getPreviousMonthTotal(ventasTotales);
    const variacion = ((totalVentas - mesAnterior) / (mesAnterior || 1)) * 100;
    const comparacion = document.getElementById('ventasComparacion');
    comparacion.innerHTML = `${variacion >= 0 ? '↑' : '↓'} ${Math.abs(variacion).toFixed(1)}% vs mes anterior`;
    comparacion.className = variacion >= 0 ? 'change-positive' : 'change-negative';
    
    // Productos vendidos
    const totalProductos = ventasFiltradas.reduce((sum, v) => sum + v.cantidad, 0);
    document.getElementById('totalProductosVendidos').textContent = totalProductos;
    
    // Ticket promedio
    const ticketPromedio = ventasFiltradas.length > 0 ? totalVentas / ventasFiltradas.length : 0;
    document.getElementById('ticketPromedio').textContent = `$${ticketPromedio.toFixed(2)}`;
    
    // Stock total
    const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0);
    document.getElementById('stockTotal').textContent = stockTotal;
    
    // Productos bajo stock (menos de 5 unidades)
    const bajoStock = productos.filter(p => p.stock < 5).length;
    document.getElementById('productosBajoStock').textContent = `${bajoStock} productos bajo stock`;
    
    // Ventas por tipo
    const ventasPorTipo = {
        sol: ventasFiltradas.filter(v => v.producto.toLowerCase().includes('sol')).length,
        armazon: ventasFiltradas.filter(v => v.producto.toLowerCase().includes('armazón')).length,
        contacto: ventasFiltradas.filter(v => v.producto.toLowerCase().includes('contacto')).length
    };
    
    document.getElementById('ventasLentesSol').textContent = ventasPorTipo.sol;
    document.getElementById('ventasArmazon').textContent = ventasPorTipo.armazon;
    document.getElementById('ventasContacto').textContent = ventasPorTipo.contacto;
    
    // Tasa de conversión (créditos vs ventas)
    const creditosPendientes = creditos.filter(c => c.estado === 'pendiente').length;
    const tasaConversion = ventasFiltradas.length > 0 
        ? ((ventasFiltradas.length - creditosPendientes) / ventasFiltradas.length * 100).toFixed(1)
        : 0;
    document.getElementById('tasaConversion').textContent = `${tasaConversion}%`;
}

// Obtener total del mes anterior
function getPreviousMonthTotal(ventas) {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    
    return ventas
        .filter(v => {
            const fecha = new Date(v.fecha);
            return fecha >= lastMonth && fecha <= lastMonthEnd;
        })
        .reduce((sum, v) => sum + v.total, 0);
}

// Actualizar gráfico de ventas por día
function updateVentasChart(ventas) {
    const ctx = document.getElementById('ventasChart').getContext('2d');
    
    // Agrupar ventas por día
    const ventasPorDia = {};
    ventas.forEach(v => {
        ventasPorDia[v.fecha] = (ventasPorDia[v.fecha] || 0) + v.total;
    });
    
    const fechas = Object.keys(ventasPorDia).sort();
    const montos = fechas.map(f => ventasPorDia[f]);
    
    if (ventasChart) {
        ventasChart.destroy();
    }
    
    ventasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Ventas ($)',
                data: montos,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

// Actualizar gráfico de top productos
function updateTopProductosChart(ventas) {
    const ctx = document.getElementById('topProductosChart').getContext('2d');
    
    // Agrupar por producto
    const ventasPorProducto = {};
    ventas.forEach(v => {
        ventasPorProducto[v.producto] = (ventasPorProducto[v.producto] || 0) + v.cantidad;
    });
    
    // Ordenar y tomar top 5
    const topProductos = Object.entries(ventasPorProducto)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    if (topProductosChart) {
        topProductosChart.destroy();
    }
    
    topProductosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topProductos.map(p => p[0]),
            datasets: [{
                label: 'Unidades Vendidas',
                data: topProductos.map(p => p[1]),
                backgroundColor: '#48bb78',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Actualizar gráfico de distribución por tipo
function updateTipoProductosChart(ventas, productos) {
    const ctx = document.getElementById('tipoProductosChart').getContext('2d');
    
    // Contar productos por tipo
    const tipos = {
        'Lentes de Sol': productos.filter(p => p.tipo === 'sol').length,
        'Lentes de Armazón': productos.filter(p => p.tipo === 'armazon').length,
        'Lentes de Contacto': productos.filter(p => p.tipo === 'contacto').length,
        'Accesorios': productos.filter(p => p.tipo === 'accesorio').length
    };
    
    if (tipoProductosChart) {
        tipoProductosChart.destroy();
    }
    
    tipoProductosChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(tipos),
            datasets: [{
                data: Object.values(tipos),
                backgroundColor: [
                    '#667eea',
                    '#48bb78',
                    '#fbbf24',
                    '#f56565'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Actualizar gráfico de créditos
function updateCreditosChart(creditos) {
    const ctx = document.getElementById('creditosChart').getContext('2d');
    
    const pagados = creditos.filter(c => c.estado === 'pagado').length;
    const pendientes = creditos.filter(c => c.estado === 'pendiente').length;
    
    if (creditosChart) {
        creditosChart.destroy();
    }
    
    creditosChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pagados', 'Pendientes'],
            datasets: [{
                data: [pagados, pendientes],
                backgroundColor: ['#48bb78', '#f56565'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
    initDatePicker();
    updateAnalytics();
    
    // Actualizar cada 5 minutos
    setInterval(updateAnalytics, 300000);
});