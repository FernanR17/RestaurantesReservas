CREATE DATABASE IF NOT EXISTS RestaurantesReservas;
USE RestaurantesReservas;

-- Tabla Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    rol ENUM('cliente', 'restaurante', 'admin') NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla Categorías
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL,
    imagen_url VARCHAR(250),
) ENGINE=InnoDB;

-- Tabla Restaurantes
CREATE TABLE IF NOT EXISTS restaurantes (
    id_restaurante INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion TEXT NOT NULL,
    categoria ENUM('italiano', 'mexicano', 'japones', 'etc') NOT NULL,
    horario_apertura TIME NOT NULL,
    horario_cierre TIME NOT NULL,
    descripcion TEXT,
    capacidad_maxima INT NOT NULL,
    mapa_url VARCHAR(500) NULL,
    imagen_url VARCHAR(255) NULL,
    id_usuario INT,
    id_categoria INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
) ENGINE=InnoDB;

-- Tabla Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_restaurante INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_reserva DATE NOT NULL,
    hora_reserva TIME NOT NULL,
    numero_personas INT NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada') NOT NULL,
    fecha_eliminacion DATETIME,
    comentarios TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante)
);

-- Tabla Opiniones
CREATE TABLE IF NOT EXISTS opiniones (
    id_opinion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_restaurante INT NOT NULL,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_opinion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante)
);

-- Relación Restaurantes - Categorías (Opcional)
ALTER TABLE restaurantes ADD COLUMN IF NOT EXISTS id_categoria INT;
ALTER TABLE restaurantes ADD FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria);

-- Insertar datos en Usuarios
INSERT INTO usuarios (nombre, email, password, telefono, rol) VALUES
('Usuario 1', 'usuario1@correo.com', 'password1', '555-1234', 'cliente'),
('Usuario 2', 'usuario2@correo.com', 'password2', '555-5678', 'cliente'),
('Usuario 3', 'usuario3@correo.com', 'password3', '555-9101', 'cliente'),
('Usuario 4', 'usuario4@correo.com', 'password4', '555-1123', 'cliente'),
('Usuario 5', 'usuario5@correo.com', 'password5', '555-1415', 'cliente'),
('Usuario 6', 'usuario6@correo.com', 'password6', '555-1617', 'cliente'),
('Usuario 7', 'usuario7@correo.com', 'password7', '555-1819', 'cliente'),
('Usuario 8', 'usuario8@correo.com', 'password8', '555-2021', 'cliente'),
('Usuario 9', 'usuario9@correo.com', 'password9', '555-2223', 'cliente'),
('Usuario 10', 'usuario10@correo.com', 'password10', '555-2425', 'cliente'),
('Restaurante Owner 1', 'restaurante1@correo.com', 'password1', '555-2627', 'restaurante'),
('Restaurante Owner 2', 'restaurante2@correo.com', 'password2', '555-2829', 'restaurante'),
('Restaurante Owner 3', 'restaurante3@correo.com', 'password3', '555-3031', 'restaurante'),
('Restaurante Owner 4', 'restaurante4@correo.com', 'password4', '555-3233', 'restaurante'),
('Restaurante Owner 5', 'restaurante5@correo.com', 'password5', '555-3435', 'restaurante'),
('Administrador', 'admin@correo.com', 'adminpass', '555-9999', 'admin');

-- Insertar datos en Categorías
INSERT INTO categorias (nombre_categoria) VALUES
('Italiana'),
('Mexicana'),
('Japonesa'),
('Internacional'),
('Vegana');

-- Insertar datos en Restaurantes
INSERT INTO restaurantes (nombre, ubicacion, categoria, horario_apertura, horario_cierre, descripcion, id_usuario, id_categoria, capacidad_maxima) VALUES
('Restaurante 1', 'Ubicación 1', 'italiano', '10:00:00', '22:00:00', 'Descripción del Restaurante 1', 11, 1, 80),
('Restaurante 2', 'Ubicación 2', 'mexicano', '10:00:00', '22:00:00', 'Descripción del Restaurante 2', 12, 2, 60),
('Restaurante 3', 'Ubicación 3', 'japones', '10:00:00', '22:00:00', 'Descripción del Restaurante 3', 13, 3, 50),
('Restaurante 4', 'Ubicación 4', 'etc', '10:00:00', '22:00:00', 'Descripción del Restaurante 4', 14, 4, 70),
('Restaurante 5', 'Ubicación 5', 'italiano', '10:00:00', '22:00:00', 'Descripción del Restaurante 5', 15, 1, 90);

-- Insertar datos en Reservas
INSERT INTO reservas (id_usuario, id_restaurante, fecha_creacion, fecha_reserva, hora_reserva, numero_personas, estado, comentarios) VALUES
(1, 1, '2025-01-08', '12:00:00', 4, 'pendiente', 'Reserva de prueba 1'),
(2, 2, '2025-01-09', '14:00:00', 2, 'confirmada', 'Reserva de prueba 2');

-- Insertar datos en Opiniones
INSERT INTO opiniones (id_usuario, id_restaurante, calificacion, comentario, fecha_opinion) VALUES
(1, 1, 5, 'Excelente servicio', '2025-01-01 12:00:00'),
(2, 2, 4, 'Buena comida', '2025-01-02 14:00:00');
