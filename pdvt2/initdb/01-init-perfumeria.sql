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

INSERT IGNORE INTO productos (codigo_barras, descripcion, tipo_producto, precio_costo, precio_venta, precio_mayoreo, cantidad, minimo_inventario, departamento) VALUES
('123456789001', 'Perfume Rose 100ml', 'normal', 200.00, 450.00, 400.00, 10, 2, 'Perfumes'),
('123456789002', 'Perfume Ocean 50ml', 'normal', 150.00, 300.00, 270.00, 8, 2, 'Perfumes'),
('123456789003', 'Esencia Floral 1L', 'liquido', 800.00, 1500.00, 1400.00, 1000.00, 100.00, 'Esencias');

INSERT IGNORE INTO clientes (nombre_completo, direccion, telefono, limite_credito, saldo_actual, suscripcion_activa, monto_minimo_mensual, fecha_ultimo_pago_mensual) VALUES
('Laura Mendoza', 'Av. Reforma 345', '5551234567', 500.00, 0.00, true, 1000.00, '2025-04-01');

INSERT IGNORE INTO usuarios (nombre_usuario, contraseña, rol, activo) VALUES
('admin', 'admin123', 'admin', true);
