CREATE DATABASE IF NOT EXISTS perfumeria_pdv;
USE perfumeria_pdv;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(50) UNIQUE,
    descripcion VARCHAR(255),
    tipo_producto ENUM('normal', 'liquido') DEFAULT 'normal',
    precio_costo DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    precio_mayoreo DECIMAL(10,2),
    cantidad DECIMAL(10,2),
    minimo_inventario DECIMAL(10,2) DEFAULT 0,
    departamento VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255),
    direccion TEXT,
    telefono VARCHAR(20),
    limite_credito DECIMAL(10,2),
    saldo_actual DECIMAL(10,2) DEFAULT 0,
    suscripcion_activa BOOLEAN DEFAULT false,
    monto_minimo_mensual DECIMAL(10,2) DEFAULT 0,
    fecha_ultimo_pago_mensual DATE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    pago DECIMAL(10,2),
    cambio DECIMAL(10,2),
    tipo_pago ENUM('efectivo', 'tarjeta', 'mixto'),
    id_cliente INT DEFAULT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad DECIMAL(10,2),
    precio_unitario DECIMAL(10,2),
    total DECIMAL(10,2),
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS corte_caja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    usuario VARCHAR(100),
    dinero_inicial DECIMAL(10,2),
    entrada_dinero DECIMAL(10,2),
    ventas_efectivo DECIMAL(10,2),
    ventas_tarjeta DECIMAL(10,2),
    pagos_clientes DECIMAL(10,2),
    pagos_proveedores DECIMAL(10,2),
    total_en_caja DECIMAL(10,2),
    ganancias DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) UNIQUE,
    contraseña VARCHAR(255),
    rol ENUM('admin', 'cajero'),
    activo BOOLEAN DEFAULT true
); 
INSERT INTO productos (codigo_barras, descripcion, tipo_producto, precio_costo, precio_venta, precio_mayoreo, cantidad, minimo_inventario, departamento) VALUES
('7501011132345', 'Perfume Hombre 100ml', 'liquido', 150.00, 300.00, 280.00, 25, 5, 'Perfumería'),
('7501011132346', 'Perfume Mujer 90ml', 'liquido', 160.00, 320.00, 290.00, 30, 5, 'Perfumería'),
('7501011132347', 'Aromatizante Ambiental 500ml', 'liquido', 50.00, 95.00, 85.00, 40, 10, 'Ambientadores'),
('7501011132348', 'Jabón de Tocador 150g', 'normal', 20.00, 45.00, 40.00, 50, 10, 'Higiene Personal'),
('7501011132349', 'Aceite Esencial Lavanda 30ml', 'liquido', 70.00, 140.00, 130.00, 15, 5, 'Aceites Esenciales');

INSERT INTO clientes (nombre_completo, direccion, telefono, limite_credito, saldo_actual, suscripcion_activa, monto_minimo_mensual, fecha_ultimo_pago_mensual) VALUES
('María Fernanda López', 'Calle Jardines #123, CDMX', '5512345678', 1500.00, 200.00, true, 300.00, '2025-04-01'),
('José Manuel Torres', 'Av. Insurgentes Sur #456, CDMX', '5523456789', 1000.00, 0.00, false, 0.00, NULL),
('Lucía Hernández Pérez', 'Col. Roma Norte #789, CDMX', '5534567890', 2000.00, 500.00, true, 500.00, '2025-03-28');

INSERT INTO usuarios (nombre_usuario, contraseña, rol, activo) VALUES
('admin', 'admin123', 'admin', true),
('cajero1', 'cajero123', 'cajero', true),
('cajero2', 'cajero456', 'cajero', true);

INSERT INTO ventas (fecha, total, pago, cambio, tipo_pago, id_cliente) VALUES
('2025-04-26 10:00:00', 395.00, 400.00, 5.00, 'efectivo', 1),
('2025-04-26 12:30:00', 140.00, 140.00, 0.00, 'tarjeta', 2),
('2025-04-26 14:15:00', 95.00, 100.00, 5.00, 'efectivo', NULL);

INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, total) VALUES
(1, 1, 1, 300.00, 300.00),
(1, 4, 2, 45.00, 90.00),
(2, 5, 1, 140.00, 140.00),
(3, 3, 1, 95.00, 95.00);


INSERT INTO corte_caja (fecha, usuario, dinero_inicial, entrada_dinero, ventas_efectivo, ventas_tarjeta, pagos_clientes, pagos_proveedores, total_en_caja, ganancias) VALUES
('2025-04-26', 'admin', 1000.00, 500.00, 395.00, 140.00, 300.00, 150.00, 2185.00, 485.00);
