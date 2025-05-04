-- 🔥 Desactivar validación de Foreign Keys temporalmente
SET FOREIGN_KEY_CHECKS=0;

-- Crear base de datos y usarla
CREATE DATABASE IF NOT EXISTS perfumeria_pdv;
USE perfumeria_pdv;

-- Crear tablas
CREATE TABLE IF NOT EXISTS kits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE,
    nombre VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(50) UNIQUE,
    descripcion VARCHAR(255),
    tipo_producto ENUM('normal', 'liquido','granel_solido') DEFAULT 'normal',
    precio_costo DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    precio_mayoreo DECIMAL(10,2),
    cantidad DECIMAL(10,2) DEFAULT 0 CHECK (cantidad >= 0),
    minimo_inventario DECIMAL(10,2) DEFAULT 0 CHECK (minimo_inventario >= 0),
    departamento VARCHAR(100),
    unidad ENUM('pz', 'ml', 'kg') DEFAULT 'pz',
    codigo_kit VARCHAR(50),
    FOREIGN KEY (codigo_kit) REFERENCES kits(codigo) ON DELETE SET NULL
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
    password VARCHAR(255),
    rol ENUM('admin', 'cajero'),
    activo BOOLEAN DEFAULT true
);


-- Insertar datos en productos

INSERT INTO kits (codigo, nombre) VALUES
('KIT001', 'Kit Belleza'),
('KIT002', 'Kit Aromaterapia'),
('KIT003', 'Kit Hogar');

INSERT INTO productos (
    codigo_barras, descripcion, tipo_producto,
    precio_costo, precio_venta, precio_mayoreo,
    cantidad, minimo_inventario, departamento,
    unidad, codigo_kit
) VALUES
('PROD0001', 'Producto de prueba 1', 'normal', 45.04, 67.56, 60.80, 69.44, 4.22, 'Perfumería', 'pz', 'KIT002'),
('PROD0002', 'Producto de prueba 2', 'liquido', 21.93, 32.89, 29.60, 49.43, 9.59, 'Belleza', 'kg', 'KIT002'),
('PROD0003', 'Producto de prueba 3', 'liquido', 14.16, 21.24, 19.12, 60.81, 6.44, 'Belleza', 'ml', 'KIT001'),
('PROD0004', 'Producto de prueba 4', 'normal', 30.50, 45.75, 41.18, 31.01, 2.44, 'Hogar', 'pz', 'KIT002'),
('PROD0005', 'Producto de prueba 5', 'normal', 49.69, 74.53, 67.08, 33.55, 4.70, 'Perfumería', 'pz', NULL),
('PROD0006', 'Producto de prueba 6', 'liquido', 13.81, 20.72, 18.65, 27.89, 8.66, 'Oficina', 'ml', NULL),
('PROD0007', 'Producto de prueba 7', 'normal', 20.41, 30.62, 27.56, 66.88, 8.30, 'Belleza', 'pz', 'KIT003'),
('PROD0008', 'Producto de prueba 8', 'normal', 13.56, 20.34, 18.31, 67.52, 6.55, 'Aromas', 'pz', NULL),
('PROD0009', 'Producto de prueba 9', 'normal', 13.34, 20.01, 18.01, 47.23, 9.45, 'Hogar', 'pz', NULL),
('PROD0010', 'Producto de prueba 10', 'liquido', 14.38, 21.57, 19.41, 94.80, 6.50, 'Hogar', 'ml', 'KIT001'),
('PROD0011', 'Producto de prueba 11', 'normal', 33.55, 50.33, 45.30, 65.82, 7.63, 'Perfumería', 'pz', NULL),
('PROD0012', 'Producto de prueba 12', 'normal', 11.89, 17.83, 16.05, 92.58, 2.46, 'Oficina', 'pz', NULL),
('PROD0013', 'Producto de prueba 13', 'liquido', 34.73, 52.10, 46.89, 43.55, 8.75, 'Perfumería', 'ml', NULL),
('PROD0014', 'Producto de prueba 14', 'liquido', 37.81, 56.72, 51.05, 33.12, 2.46, 'Hogar', 'ml', 'KIT003'),
('PROD0015', 'Producto de prueba 15', 'liquido', 34.68, 52.02, 46.82, 53.63, 6.44, 'Belleza', 'ml', 'KIT003'),
('PROD0016', 'Producto de prueba 16', 'liquido', 12.41, 18.62, 16.76, 56.63, 1.77, 'Aromas', 'ml', NULL),
('PROD0017', 'Producto de prueba 17', 'normal', 39.93, 59.90, 53.91, 63.23, 2.73, 'Perfumería', 'pz', NULL),
('PROD0018', 'Producto de prueba 18', 'liquido', 25.38, 38.07, 34.26, 20.42, 6.00, 'Hogar', 'ml', 'KIT002'),
('PROD0019', 'Producto de prueba 19', 'liquido', 39.86, 59.79, 53.81, 75.15, 6.64, 'Perfumería', 'ml', NULL),
('PROD0020', 'Producto de prueba 20', 'liquido', 11.70, 17.55, 15.79, 89.96, 2.76, 'Aromas', 'ml', NULL),
('PROD0021', 'Producto de prueba 21', 'liquido', 38.88, 58.32, 52.49, 43.59, 1.99, 'Aromas', 'ml', 'KIT003'),
('PROD0022', 'Producto de prueba 22', 'normal', 47.58, 71.37, 64.24, 12.50, 4.69, 'Belleza', 'pz', NULL),
('PROD0023', 'Producto de prueba 23', 'normal', 31.20, 46.80, 42.12, 57.09, 8.93, 'Oficina', 'pz', 'KIT001'),
('PROD0024', 'Producto de prueba 24', 'normal', 18.69, 28.04, 25.24, 91.28, 7.94, 'Belleza', 'pz', NULL),
('PROD0025', 'Producto de prueba 25', 'liquido', 38.69, 58.04, 52.24, 89.50, 1.38, 'Aromas', 'ml', NULL),
('PROD0026', 'Producto de prueba 26', 'liquido', 12.70, 19.05, 17.14, 19.41, 6.77, 'Hogar', 'ml', 'KIT001'),
('PROD0027', 'Producto de prueba 27', 'normal', 40.38, 60.57, 54.51, 22.90, 4.44, 'Perfumería', 'pz', NULL),
('PROD0028', 'Producto de prueba 28', 'normal', 24.69, 37.04, 33.34, 71.82, 5.94, 'Hogar', 'pz', NULL),
('PROD0029', 'Producto de prueba 29', 'liquido', 19.10, 28.65, 25.78, 41.58, 4.20, 'Aromas', 'ml', NULL),
('PROD0030', 'Producto de prueba 30', 'liquido', 22.36, 33.54, 30.19, 71.52, 5.21, 'Oficina', 'ml', NULL);

-- Insertar datos en clientes
INSERT INTO clientes (nombre_completo, direccion, telefono, limite_credito, saldo_actual, suscripcion_activa, monto_minimo_mensual, fecha_ultimo_pago_mensual) VALUES
('María Fernanda López', 'Calle Jardines #123, CDMX', '5512345678', 1500.00, 200.00, true, 300.00, '2025-04-01'),
('José Manuel Torres', 'Av. Insurgentes Sur #456, CDMX', '5523456789', 1000.00, 0.00, false, 0.00, NULL),
('Lucía Hernández Pérez', 'Col. Roma Norte #789, CDMX', '5534567890', 2000.00, 500.00, true, 500.00, '2025-03-28');

-- Insertar datos en usuarios
INSERT INTO usuarios (nombre_usuario, password, rol, activo) VALUES
('admin', 'admin123', 'admin', true),
('cajero1', 'cajero123', 'cajero', true),
('cajero2', 'cajero456', 'cajero', true);


-- Insertar datos en ventas
INSERT INTO ventas (fecha, total, pago, cambio, tipo_pago, id_cliente) VALUES
('2025-04-26 10:00:00', 395.00, 400.00, 5.00, 'efectivo', 1),
('2025-04-26 12:30:00', 140.00, 140.00, 0.00, 'tarjeta', 2),
('2025-04-26 14:15:00', 95.00, 100.00, 5.00, 'efectivo', NULL);

-- Insertar datos en detalle_ventas
INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, total) VALUES
(1, 1, 1, 300.00, 300.00),
(1, 4, 2, 45.00, 90.00),
(2, 5, 1, 140.00, 140.00),
(3, 3, 1, 95.00, 95.00);

-- Insertar datos en corte_caja
INSERT INTO corte_caja (fecha, usuario, dinero_inicial, entrada_dinero, ventas_efectivo, ventas_tarjeta, pagos_clientes, pagos_proveedores, total_en_caja, ganancias) VALUES
('2025-04-26', 'admin', 1000.00, 500.00, 395.00, 140.00, 300.00, 150.00, 2185.00, 485.00);

-- 🔥 Activar validación de Foreign Keys nuevamente
SET FOREIGN_KEY_CHECKS=1;
