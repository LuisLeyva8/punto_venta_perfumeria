// Esperar a que el contenido se haya cargado antes de inicializar
document.addEventListener('DOMContentLoaded', () => {

    // Elementos del DOM
    const filtroPeriodo = document.getElementById('filtroPeriodo');
    const ventasPeriodo = document.getElementById('ventasPeriodo');
    const productosVendidos = document.getElementById('productosVendidos');
    const ganancias = document.getElementById('ganancias');
    const exportarExcel = document.getElementById('exportarExcel');
  
    // Gráficas
    let graficaVentas = null;
    let graficaProductos = null;
  
    // Datos de ejemplo
    const datosSimulados = {
      hoy: {
        ventas: 100,
        productos: 11,
        ganancias: 60,
        ventasPorDia: [100],
        productosPorDia: [11],
        labels: ["Hoy"]
      },
      semana: {
        ventas: 720,
        productos: 56,
        ganancias: 420,
        ventasPorDia: [100, 150, 120, 80, 90, 100, 80],
        productosPorDia: [5, 10, 9, 6, 8, 10, 8],
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
      },
      mes: {
        ventas: 3200,
        productos: 234,
        ganancias: 1800,
        ventasPorDia: Array.from({ length: 30 }, () => Math.floor(Math.random() * 200)),
        productosPorDia: Array.from({ length: 30 }, () => Math.floor(Math.random() * 15)),
        labels: Array.from({ length: 30 }, (_, i) => `Día ${i + 1}`)
      }
    };
  
    // Función para actualizar dashboard
    function actualizarDashboard(periodo) {
      const data = datosSimulados[periodo];
  
      if (!data) return;
  
      ventasPeriodo.textContent = `$${data.ventas.toFixed(2)}`;
      productosVendidos.textContent = data.productos;
      ganancias.textContent = `$${data.ganancias.toFixed(2)}`;
  
      actualizarGraficas(data.labels, data.ventasPorDia, data.productosPorDia);
    }
  
    // Función para actualizar las gráficas
    function actualizarGraficas(labels, datosVentas, datosProductos) {
      const ctxVentas = document.getElementById('graficaVentas').getContext('2d');
      const ctxProductos = document.getElementById('graficaProductos').getContext('2d');
  
      // Destruir gráficos anteriores si existen
      if (graficaVentas) graficaVentas.destroy();
      if (graficaProductos) graficaProductos.destroy();
  
      graficaVentas = new Chart(ctxVentas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Ventas ($)',
            data: datosVentas,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
  
      graficaProductos = new Chart(ctxProductos, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Productos Vendidos',
            data: datosProductos,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
    }
  
    // Evento para cambiar el filtro
    filtroPeriodo.addEventListener('change', () => {
      const periodoSeleccionado = filtroPeriodo.value;
      actualizarDashboard(periodoSeleccionado);
    });
  
    // Evento para exportar (simulado)
    exportarExcel.addEventListener('click', () => {
      alert('📄 Función de exportar a Excel en desarrollo.');
    });
  
    // Cargar datos iniciales
    actualizarDashboard('hoy');
  });
  