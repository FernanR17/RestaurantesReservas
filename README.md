# 🍴 Restaurantes Reservas

Este proyecto es una aplicación web diseñada para gestionar reservas en restaurantes, proporcionando interfaces diferenciadas para administradores, restaurantes y clientes. 
La aplicación permite realizar un seguimiento eficiente de reservas, gestionar usuarios y administrar información clave de los restaurantes.

Este proyecto fue realizado para la graduacion del Bootcamp Google Developer junto a Conexion El Salvador

## 🚀 Características

- **Página de Inicio (Home):** Presentación de la plataforma con categorías destacadas y opiniones recientes.
- **Gestión de Restaurantes:**
  - Creación, edición y eliminación de restaurantes.
  - Visualización de estadísticas relacionadas con reservas.
- **Gestión de Reservas:**
  - Los clientes pueden realizar reservas para un restaurante específico.
  - Los dueños de restaurantes pueden gestionar sus reservas (confirmar, cancelar o editar).
- **Panel de Administración:**
  - Gestión de usuarios registrados en el sistema.
  - Administración de restaurantes y categorías.
- **Autenticación:**
  - Sistema de inicio de sesión con redirecciones basadas en roles (`admin`, `restaurante`, `cliente`).
  - Manejo de autenticación persistente utilizando `context` y `localStorage`.

## 🗂️ Tablas Utilizadas en la Base de Datos

### Usuarios
Contiene los datos de los usuarios registrados en la plataforma.
- **Campos:** `id_usuario`, `nombre`, `email`, `password`, `telefono`, `rol`.

### Restaurantes
Gestión de información de los restaurantes.
- **Campos:** `id_restaurante`, `nombre`, `ubicacion`, `categoria`, `horario_apertura`, `horario_cierre`, `descripcion`, `capacidad_maxima`, `id_usuario`, `imagen_url`, `mapa_url`.

### Reservas
Controla las reservas realizadas por los clientes.
- **Campos:** `id_reserva`, `id_usuario`, `id_restaurante`, `fecha_reserva`, `hora_reserva`, `numero_personas`, `estado`, `comentarios`.

### Categorías
Define las categorías de restaurantes.
- **Campos:** `id_categoria`, `nombre_categoria`, `imagen_url`.

### Opiniones
Guarda los comentarios y calificaciones de los clientes sobre los restaurantes.
- **Campos:** `id_opinion`, `id_usuario`, `id_restaurante`, `comentario`, `calificacion`, `fecha_opinion`.

## 📋 Flujo del Proyecto

1. **Página Pública:**
   - Los usuarios pueden explorar la lista de restaurantes y categorías sin iniciar sesión.
   - Opción para registrarse o iniciar sesión según el rol del usuario.

2. **Panel de Clientes:**
   - Permite realizar reservas en restaurantes disponibles.
   - Muestra un historial de reservas realizadas.

3. **Panel de Restaurantes:**
   - Los dueños de restaurantes pueden gestionar la información de su restaurante.
   - Visualización de estadísticas, incluyendo el número de reservas confirmadas y activas.
   - Gestión de reservas (confirmar, cancelar o editar).

4. **Panel de Administración:**
   - Gestión centralizada de usuarios, restaurantes y categorías.
   - Creación de nuevos usuarios con roles específicos.

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - React con Hooks y Context API.
  - Tailwind CSS para el diseño visual.
  - SweetAlert2 para alertas y notificaciones.

- **Backend:**
  - PHP con manejo de rutas en un solo archivo (`api.php`).
  - PDO para la interacción con la base de datos MySQL.

- **Base de Datos:**
  - MySQL con tablas estructuradas para usuarios, restaurantes, reservas, categorías y opiniones.

## 🌐 Instalación del Proyecto

1. Clona este repositorio:
   ```bash
   git clone https://github.com/SpecialSKG/RestaurantesReservas.git
   
   cd restaurantes-reservas
   
2. Instala las dependencias del frontend:
   ```bash
   npm install
   
3.Configura la base de datos:
  Importa el archivo SQL proporcionado en tu servidor MySQL.
  Asegúrate de configurar las credenciales de la base de datos en el archivo api.php en el backend.
  
4. Inicia el servidor de desarrollo:
   ```bash
   npm start

5. Configura el servidor backend:
  Asegúrate de que tu servidor PHP esté configurado para apuntar a la carpeta donde se encuentra el archivo `api.php`.
  Configura los permisos de escritura para la carpeta donde se almacenan las imágenes si usas la funcionalidad de subida.

## 🌐 Manuales de usuario
El sistema incluye manuales de usuario diseñados específicamente para cada rol dentro de la plataforma (Clientes, Restaurantes y Administradores). Estos manuales brindan instrucciones detalladas sobre cómo utilizar las funcionalidades disponibles, resolver problemas comunes y contactar al soporte técnico en caso de ser necesario. [Accede a ellos](https://drive.google.com/drive/folders/18Nad0BHRBbmnODD5EiamIbNz95i_C_Ch?usp=sharing)

##🤝 Contribuciones
¡Las contribuciones son bienvenidas! Este proyecto se trabajo con un grupo de trabajo en un Bootcamp de la empresa Conexion El Salvador.
Si tienes una idea para mejorar este proyecto, puedes hacer un buen pull.

##📝 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
