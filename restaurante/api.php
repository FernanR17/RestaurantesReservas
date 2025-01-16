<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
    exit(0);
}

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');

class API
{
    private $db;

    function __construct()
    {
        $dsn = 'mysql:host=localhost;dbname=RestaurantesReservas';
        $username = 'root';
        $password = '';

        try {
            $this->db = new PDO($dsn, $username, $password);
            $this->db->exec("set names utf8");
        } catch (PDOException $e) {
            die(json_encode(array('error' => 'Error de conexión: ' . $e->getMessage())));
        }
    }

    function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

        switch ($request[0]) {
            case 'restaurantes':
                if ($method == 'GET') {
                    if (isset($_GET['usuario'])) {
                        $this->getRestauranteByUsuario($_GET['usuario']);
                    } elseif (isset($request[1])) {
                        $id = $request[1];
                        $this->getRestaurante($id);
                    } else {
                        $this->getAllRestaurantes();
                    }
                } elseif ($method == 'POST') {
                    $data = json_decode(file_get_contents("php://input"), true);
                    $this->createRestaurante($data);
                } elseif ($method == 'PUT' && isset($request[1])) {
                    $id = $request[1];
                    $data = json_decode(file_get_contents("php://input"), true);
                    $this->updateRestaurante($id, $data);
                } elseif ($method == 'DELETE' && isset($request[1])) {
                    $id = $request[1];
                    $this->deleteRestaurante($id);
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido']);
                }
                break;


            case 'homepage': // Nuevo caso para la página principal
                if ($method == 'GET') {
                    $this->getHomepageData();
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido']);
                }
                break;

            case 'opiniones':
                if ($method == 'GET' && isset($request[1])) {
                    $this->getOpinionesPorRestaurante($request[1]);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Ruta no encontrada']);
                }
                break;

            case 'auth':
                if ($method == 'POST') {
                    $data = json_decode(file_get_contents("php://input"), true);
                    if (isset($request[1]) && $request[1] == 'register') {
                        $this->registerUser($data);
                    } elseif (isset($request[1]) && $request[1] == 'login') {
                        $this->loginUser($data);
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Ruta no encontrada']);
                    }
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido']);
                }
                break;

            case 'register': // Ruta para el registro de usuarios
                if ($method == 'POST') { // Solo acepta POST
                    $data = json_decode(file_get_contents("php://input"), true);
                    $this->registerUser($data);
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido']);
                }
                break;

            case 'reservas':
                if ($method == 'GET') {
                    if (isset($request[1])) {
                        $this->getReserva($request[1]); // Obtener una reserva específica por ID
                    } elseif (isset($_GET['id_usuario'])) {
                        $this->getReservasPorUsuario($_GET['id_usuario']); // Obtener reservas por usuario
                    } else {
                        $this->getAllReservas(); // Obtener todas las reservas
                    }
                } elseif ($method == 'POST') {
                    $data = json_decode(file_get_contents("php://input"), true);
                    $this->createReserva($data);
                } elseif ($method == 'PUT' && isset($request[1])) {
                    $id = $request[1];
                    $data = json_decode(file_get_contents("php://input"), true);

                    if (isset($data['estado'])) {
                        $this->actualizarEstadoReserva($id, $data['estado']);
                    } else {
                        $this->updateReserva($id, $data);
                    }
                } elseif ($method == 'DELETE' && isset($request[1])) {
                    $id = $request[1];
                    $this->deleteReserva($id);
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido']);
                }
                break;

            case 'usuarios':
                if ($method == 'GET') {
                    if (isset($request[1])) {
                        $id_usuario = $request[1];
                        $this->getUser($id_usuario);
                    } else {
                        $this->getAllUsuarios(); // Nueva funcionalidad para obtener todos los usuarios
                    }
                } elseif ($method == 'PUT' && isset($request[1])) {
                    $id_usuario = $request[1];
                    $data = json_decode(file_get_contents("php://input"), true);
                    $this->updateUser($id_usuario, $data);
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido.']);
                }
                break;

            case 'reservas_por_restaurante':
                if ($method == 'GET') {
                    $this->getReservasPorRestaurante();
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido']);
                }

                break;

            case 'reservas_activas':
                if ($method == 'GET') {
                    $this->getReservasActivas();
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido']);
                }
                break;

            case 'categorias':
                if ($method == 'GET') {
                    $this->getAllCategorias();
                } elseif ($method == 'POST') {
                    $data = json_decode(file_get_contents("php://input"), true);
                    $this->createCategoria($data);
                } elseif ($method == 'PUT' && isset($request[1])) {
                    $id_categoria = $request[1];
                    $data = json_decode(file_get_contents("php://input"), true);
                    $this->updateCategoria($id_categoria, $data);
                } elseif ($method == 'DELETE' && isset($request[1])) {
                    $id_categoria = $request[1];
                    $this->deleteCategoria($id_categoria);
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido']);
                }
                break;

            case 'estadisticas-reservas':
                if ($method == 'GET' && isset($_GET['id_restaurante'])) {
                    $id_restaurante = $_GET['id_restaurante'];
                    $this->getReservasConClientePorRestaurante($id_restaurante);
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido o parámetros faltantes']);
                }
                break;

            case 'reservas_con_clientes':
                if ($method == 'GET' && isset($_GET['id_restaurante'])) {
                    $this->getReservasConClientePorRestaurante($_GET['id_restaurante']);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Parámetro id_restaurante requerido.']);
                }
                break;


            default:
                http_response_code(404);
                echo json_encode(array('error' => 'Ruta no encontrada'));
        }
    }

    function registerUser($data)
    {
        try {
            $query = $this->db->prepare("
                INSERT INTO usuarios (nombre, email, password, telefono, rol) 
                VALUES (:nombre, :email, :password, :telefono, 'cliente')
            ");
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT); // Generar el hash
            $query->bindParam(':nombre', $data['nombre']);
            $query->bindParam(':email', $data['email']);
            $query->bindParam(':password', $hashedPassword); // Pasar la variable con el hash
            $query->bindParam(':telefono', $data['telefono']);

            if ($query->execute()) {
                http_response_code(201);
                echo json_encode(['message' => 'Usuario registrado exitosamente.']);
            }
        } catch (PDOException $e) {
            $errorCode = $e->getCode();
            if ($errorCode == 23000) {
                http_response_code(400);
                echo json_encode(['error' => 'El correo electrónico ya está registrado.']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Ocurrió un error interno.']);
            }
        }
    }

    function loginUser($data)
    {
        try {
            $query = $this->db->prepare("SELECT * FROM usuarios WHERE email = :email");
            $query->bindParam(':email', $data['email']);
            $query->execute();
            $user = $query->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($data['password'], $user['password'])) {
                http_response_code(200);
                echo json_encode([
                    'message' => 'Inicio de sesión exitoso',
                    'user' => ['id_usuario' => $user['id_usuario'], 'nombre' => $user['nombre'], 'rol' => $user['rol']]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Credenciales inválidas']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al iniciar sesión: ' . $e->getMessage()]);
        }
    }

    function getAllUsuarios()
    {
        $query = $this->db->prepare("SELECT id_usuario, nombre, email, telefono, rol FROM usuarios");
        $query->execute();
        $usuarios = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($usuarios);
    }

    function getUser($id_usuario)
    {
        $query = $this->db->prepare("SELECT id_usuario, nombre, email, telefono, rol FROM usuarios WHERE id_usuario = :id_usuario");
        $query->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $query->execute();
        $user = $query->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado.']);
        }
    }

    function updateUser($id_usuario, $data)
    {
        try {
            $query = $this->db->prepare("
                UPDATE usuarios
                SET nombre = :nombre, email = :email, telefono = :telefono
                WHERE id_usuario = :id_usuario
            ");
            $query->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $query->bindParam(':nombre', $data['nombre']);
            $query->bindParam(':email', $data['email']);
            $query->bindParam(':telefono', $data['telefono']);
            $query->execute();

            http_response_code(200);
            echo json_encode(['message' => 'Usuario actualizado correctamente.']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar el usuario: ' . $e->getMessage()]);
        }
    }

    function getHomepageData()
    {
        try {
            // Obtener categorías
            $queryCategorias = $this->db->prepare("SELECT id_categoria, nombre_categoria, imagen_url FROM categorias");
            $queryCategorias->execute();
            $categorias = $queryCategorias->fetchAll(PDO::FETCH_ASSOC);

            // Obtener opiniones recientes
            $queryOpiniones = $this->db->prepare("
                SELECT o.id_opinion, o.comentario, o.calificacion, u.nombre AS usuario, r.nombre AS restaurante
                FROM opiniones o
                JOIN usuarios u ON o.id_usuario = u.id_usuario
                JOIN restaurantes r ON o.id_restaurante = r.id_restaurante
                ORDER BY o.fecha_opinion DESC
                LIMIT 6
            ");
            $queryOpiniones->execute();
            $opiniones = $queryOpiniones->fetchAll(PDO::FETCH_ASSOC);

            // Respuesta combinada
            echo json_encode([
                'categorias' => $categorias,
                'opiniones' => $opiniones
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener los datos: ' . $e->getMessage()]);
        }
    }


    // ----------------------------------------------------

    function getAllRestaurantes()
    {
        $query = $this->db->prepare("SELECT * FROM restaurantes");
        $query->execute();
        $restaurantes = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($restaurantes);
    }

    function getRestaurante($id)
    {
        $query = "SELECT * FROM restaurantes WHERE id_restaurante = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $restaurante = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($restaurante) {
            // Obtiene el número de reservas activas
            $reservas_activas = $this->getReservasActivasPorRestaurante($id);
            $restaurante['reservas_activas'] = $reservas_activas; // Añade al arreglo
            echo json_encode($restaurante);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'El restaurante no existe']);
        }
    }


    function getRestauranteByUsuario($id_usuario)
    {
        $query = $this->db->prepare("SELECT * FROM restaurantes WHERE id_usuario = :id_usuario");
        $query->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $query->execute();
        $restaurante = $query->fetch(PDO::FETCH_ASSOC);

        if ($restaurante) {
            $reservas_activas = $this->getReservasActivasPorRestaurante($restaurante['id_restaurante']);
            $restaurante['reservas_activas'] = $reservas_activas; // Agregar las reservas activas
            echo json_encode($restaurante);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'El restaurante no existe']);
        }
    }


    function getRestauranteIdPorUsuario($id_usuario)
    {
        $query = "SELECT id_restaurante FROM restaurantes WHERE id_usuario = :id_usuario";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ? $result['id_restaurante'] : null;
    }

    function getReservasPorRestaurante()
    {
        if (!isset($_GET['id_restaurante']) || !isset($_GET['estado'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Parámetros id_restaurante y estado requeridos']);
            return;
        }

        $id_restaurante = $_GET['id_restaurante'];
        $estado = $_GET['estado'];

        $query = "SELECT r.id_reserva, r.fecha_reserva, r.hora_reserva, r.numero_personas, r.estado, r.comentarios, u.nombre AS cliente
                  FROM reservas r
                  JOIN usuarios u ON r.id_usuario = u.id_usuario
                  WHERE r.id_restaurante = :id_restaurante AND r.estado = :estado";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id_restaurante', $id_restaurante, PDO::PARAM_INT);
        $stmt->bindParam(':estado', $estado, PDO::PARAM_STR);
        $stmt->execute();

        $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($reservas);
    }


    function isGoogleMapsEmbedUrl($url)
    {
        // Verificar que el enlace sea un iframe válido de Google Maps
        return preg_match('/^https:\/\/www\.google\.com\/maps\/embed\?pb=/', $url);
    }

    function createRestaurante($data)
{
    try {
        // Validar campos obligatorios
        if (empty($data['nombre']) || empty($data['ubicacion']) || empty($data['categoria']) || empty($data['id_usuario'])) {
            throw new Exception("Faltan campos obligatorios (nombre, ubicación, categoría o id_usuario).");
        }

        // Validar mapa_url
        $mapa_url = isset($data['mapa_url']) && $this->isGoogleMapsEmbedUrl($data['mapa_url']) 
            ? $data['mapa_url'] 
            : null;

        $query = $this->db->prepare("
            INSERT INTO restaurantes (nombre, ubicacion, categoria, horario_apertura, horario_cierre, descripcion, capacidad_maxima, mapa_url, id_usuario)
            VALUES (:nombre, :ubicacion, :categoria, :horario_apertura, :horario_cierre, :descripcion, :capacidad_maxima, :mapa_url, :id_usuario)
        ");
        $query->bindParam(':nombre', $data['nombre']);
        $query->bindParam(':ubicacion', $data['ubicacion']);
        $query->bindParam(':categoria', $data['categoria']);
        $query->bindParam(':horario_apertura', $data['horario_apertura']);
        $query->bindParam(':horario_cierre', $data['horario_cierre']);
        $query->bindParam(':descripcion', $data['descripcion']);
        $query->bindParam(':capacidad_maxima', $data['capacidad_maxima'], PDO::PARAM_INT);
        $query->bindParam(':mapa_url', $mapa_url);
        $query->bindParam(':id_usuario', $data['id_usuario'], PDO::PARAM_INT);

        if ($query->execute()) {
            $id_restaurante = $this->db->lastInsertId();
            http_response_code(201);
            echo json_encode([
                'message' => 'Restaurante creado exitosamente.',
                'id_restaurante' => $id_restaurante
            ]);
        }
    } catch (PDOException $e) {
        $errorCode = $e->getCode();
        if ($errorCode == 23000) {
            http_response_code(400);
            echo json_encode(['error' => 'Ya existe un restaurante con esos datos.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear restaurante: ' . $e->getMessage()]);
        }
    }
}



    function deleteRestaurante($id)
    {
        $query = $this->db->prepare("DELETE FROM restaurantes WHERE id_restaurante = :id");
        $query->bindParam(':id', $id, PDO::PARAM_INT);
        if ($query->execute()) {
            http_response_code(200);
            echo json_encode(array('message' => 'Restaurante eliminado'));
        }
    }


    function getOpinionesPorRestaurante($id_restaurante)
    {
        $query = $this->db->prepare("
            SELECT o.comentario, o.calificacion, u.nombre AS usuario
            FROM opiniones o
            JOIN usuarios u ON o.id_usuario = u.id_usuario
            WHERE o.id_restaurante = :id_restaurante
            ORDER BY o.calificacion DESC
            LIMIT 3
        ");
        $query->bindParam(':id_restaurante', $id_restaurante, PDO::PARAM_INT);
        $query->execute();
        $opiniones = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($opiniones);
    }

    function getReservasActivasPorRestaurante($id_restaurante)
    {
        $query = "
            SELECT COUNT(*) AS reservas_activas 
            FROM reservas 
            WHERE id_restaurante = :id_restaurante AND estado IN ('confirmada', 'completada')
        ";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id_restaurante', $id_restaurante, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result['reservas_activas'] ?? 0;
    }

    private function handleImageUpload($file, $targetDir = "public/uploads/restaurantes/")
    {
        // Validar que se haya enviado un archivo válido
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("No se ha enviado una imagen válida.");
        }

        // Verificar si la carpeta existe
        if (!is_dir($targetDir)) {
            if (!mkdir($targetDir, 0777, true)) {
                throw new Exception("No se pudo crear el directorio para las imágenes.");
            }
        }

        // Validar el tipo y tamaño del archivo
        $imageFileType = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        $validTypes = ["jpg", "jpeg", "png", "gif"];
        if (!in_array($imageFileType, $validTypes)) {
            throw new Exception("Tipo de archivo no permitido. Solo se permiten JPG, JPEG, PNG y GIF.");
        }
        if ($file["size"] > 5000000) { // 5MB
            throw new Exception("El archivo es demasiado grande. Tamaño máximo: 5MB.");
        }

        // Generar un nombre único para la imagen
        $uniqueName = md5(uniqid(rand(), true)) . "." . $imageFileType;
        $targetFile = $targetDir . $uniqueName;
        $relativePath = $targetDir . $uniqueName;

        // Mover el archivo al directorio de destino
        if (!move_uploaded_file($file["tmp_name"], $targetFile)) {
            throw new Exception("Error al mover el archivo.");
        }

        return $relativePath; // Ruta relativa para guardar en la base de datos
    }

    function uploadRestauranteImagen($id_restaurante)
    {
        try {
            // Llamar a la función genérica para manejar la carga
            $relativePath = $this->handleImageUpload($_FILES['imagen'], __DIR__ . "/public/uploads/restaurantes/");

            // Actualizar la URL de la imagen en la base de datos
            $query = $this->db->prepare("
                UPDATE restaurantes 
                SET imagen_url = :imagen_url 
                WHERE id_restaurante = :id_restaurante
            ");
            $query->bindParam(':imagen_url', $relativePath);
            $query->bindParam(':id_restaurante', $id_restaurante, PDO::PARAM_INT);
            $query->execute();

            http_response_code(200);
            echo json_encode(['message' => 'Imagen subida correctamente.', 'imagen_url' => $relativePath]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    function updateRestaurante($id, $data)
    {
        try {
            if (empty($data['nombre']) || empty($data['ubicacion']) || empty($data['categoria'])) {
                throw new Exception("Faltan campos obligatorios.");
            }

            $query = $this->db->prepare("
            UPDATE restaurantes
            SET nombre = :nombre,
                ubicacion = :ubicacion,
                categoria = :categoria,
                horario_apertura = :horario_apertura,
                horario_cierre = :horario_cierre,
                descripcion = :descripcion,
                capacidad_maxima = :capacidad_maxima,
                mapa_url = :mapa_url
            WHERE id_restaurante = :id
        ");

            $query->bindParam(':id', $id, PDO::PARAM_INT);
            $query->bindParam(':nombre', $data['nombre']);
            $query->bindParam(':ubicacion', $data['ubicacion']);
            $query->bindParam(':categoria', $data['categoria']);
            $query->bindParam(':horario_apertura', $data['horario_apertura']);
            $query->bindParam(':horario_cierre', $data['horario_cierre']);
            $query->bindParam(':descripcion', $data['descripcion']);
            $query->bindParam(':capacidad_maxima', $data['capacidad_maxima']);
            $query->bindParam(':mapa_url', $data['mapa_url']);

            if ($query->execute()) {
                http_response_code(200);
                echo json_encode(['message' => 'Restaurante actualizado correctamente.']);
            } else {
                throw new Exception("Error al ejecutar la consulta.");
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Función para obtener las reservas con información del cliente
    function getReservasConClientePorRestaurante($id_restaurante)
    {
        try {
            $query = "
                SELECT r.id_reserva, r.fecha_reserva, r.hora_reserva, r.numero_personas, r.estado, r.comentarios, u.nombre AS cliente
                FROM reservas r
                INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
                WHERE r.id_restaurante = :id_restaurante
                ORDER BY r.fecha_reserva ASC, r.hora_reserva ASC
            ";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id_restaurante', $id_restaurante, PDO::PARAM_INT);
            $stmt->execute();

            $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($reservas) {
                echo json_encode($reservas);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'No se encontraron reservas.']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener reservas: ' . $e->getMessage()]);
        }
    }



    // ----------------------------------------------------

    function getAllReservas()
    {
        $query = $this->db->prepare("
        SELECT id_reserva, id_usuario, id_restaurante, fecha_creacion, fecha_reserva, hora_reserva, numero_personas, estado, comentarios 
        FROM reservas
    ");
        $query->execute();
        $reservas = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($reservas);
    }

    function getReserva($id)
    {
        $query = $this->db->prepare("
        SELECT id_reserva, id_usuario, id_restaurante, fecha_creacion, fecha_reserva, hora_reserva, numero_personas, estado, comentarios 
        FROM reservas
        WHERE id_reserva = :id
    ");
        $query->bindParam(':id', $id, PDO::PARAM_INT);
        $query->execute();
        $reserva = $query->fetch(PDO::FETCH_ASSOC);
        if ($reserva) {
            echo json_encode($reserva);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Reserva no encontrada']);
        }
    }

    function getReservasPorUsuario($id_usuario)
    {
        $query = $this->db->prepare("
        SELECT id_reserva, id_usuario, id_restaurante, fecha_creacion, fecha_reserva, hora_reserva, numero_personas, estado, comentarios 
        FROM reservas
        WHERE id_usuario = :id_usuario
    ");
        $query->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $query->execute();
        $reservas = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($reservas);
    }

    function createReserva($data)
    {
        try {
            $query = $this->db->prepare("
                INSERT INTO reservas (id_usuario, id_restaurante, fecha_creacion, fecha_reserva, hora_reserva, numero_personas, estado, comentarios)
                VALUES (:id_usuario, :id_restaurante, NOW(), :fecha_reserva, :hora_reserva, :numero_personas, :estado, :comentarios)
            ");

            $query->bindParam(':id_usuario', $data['id_usuario']);
            $query->bindParam(':id_restaurante', $data['id_restaurante']);
            $query->bindParam(':fecha_reserva', $data['fecha_reserva']);
            $query->bindParam(':hora_reserva', $data['hora_reserva']);
            $query->bindParam(':numero_personas', $data['numero_personas']);

            // Si no se recibe estado, predeterminado a 'pendiente'
            $estado = isset($data['estado']) ? $data['estado'] : 'pendiente';
            $query->bindParam(':estado', $estado);

            $query->bindParam(':comentarios', $data['comentarios']);

            if ($query->execute()) {
                http_response_code(201);
                echo json_encode(['message' => 'Reserva creada exitosamente.']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear reserva: ' . $e->getMessage()]);
        }
    }

    function updateReserva($id, $data)
    {
        try {
            $query = $this->db->prepare("
            UPDATE reservas 
            SET fecha_reserva = :fecha_reserva, hora_reserva = :hora_reserva, numero_personas = :numero_personas, estado = :estado, comentarios = :comentarios
            WHERE id_reserva = :id
        ");

            $query->bindParam(':id', $id, PDO::PARAM_INT);
            $query->bindParam(':fecha_reserva', $data['fecha_reserva']);
            $query->bindParam(':hora_reserva', $data['hora_reserva']);
            $query->bindParam(':numero_personas', $data['numero_personas'], PDO::PARAM_INT);
            $query->bindParam(':estado', $data['estado']);
            $query->bindParam(':comentarios', $data['comentarios']);
            $query->execute();

            http_response_code(200);
            echo json_encode(['message' => 'Reserva actualizada exitosamente']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar la reserva: ' . $e->getMessage()]);
        }
    }

    function deleteReserva($id)
    {
        try {
            $query = $this->db->prepare("DELETE FROM reservas WHERE id_reserva = :id");
            $query->bindParam(':id', $id, PDO::PARAM_INT);
            $query->execute();

            http_response_code(200);
            echo json_encode(['message' => 'Reserva eliminada exitosamente']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar la reserva: ' . $e->getMessage()]);
        }
    }

    function actualizarEstadoReserva($id, $estado)
    {
        try {
            $query = "
                UPDATE reservas 
                SET estado = :estado
                WHERE id_reserva = :id
            ";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':estado', $estado);
            $stmt->execute();

            http_response_code(200);
            echo json_encode(['message' => 'Estado de la reserva actualizado exitosamente']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar el estado de la reserva: ' . $e->getMessage()]);
        }
    }

    function getReservasActivas()
    {
        if (!isset($_GET['id_restaurante'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Parámetro id_restaurante requerido']);
            return;
        }

        $id_restaurante = $_GET['id_restaurante'];

        $query = "SELECT COUNT(*) AS reservas_activas FROM reservas WHERE id_restaurante = :id_restaurante AND estado = 'confirmada'";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id_restaurante', $id_restaurante, PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            echo json_encode($result);
        } else {
            echo json_encode(['reservas_activas' => 0]);
        }
    }

    // ----------------------------------------------------
    function getAllCategorias()
    {
        try {
            $query = $this->db->prepare("SELECT id_categoria, nombre_categoria, imagen_url FROM categorias");
            $query->execute();
            $categorias = $query->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($categorias);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener categorías: ' . $e->getMessage()]);
        }
    }

    function createCategoria($data)
    {
        try {
            $query = $this->db->prepare("INSERT INTO categorias (nombre_categoria, imagen_url) VALUES (:nombre_categoria, :imagen_url)");
            $query->bindParam(':nombre_categoria', $data['nombre_categoria']);
            $query->bindParam(':imagen_url', $data['imagen_url']);
            $query->execute();
            http_response_code(201);
            echo json_encode(['message' => 'Categoría creada exitosamente']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear categoría: ' . $e->getMessage()]);
        }
    }

    function updateCategoria($id_categoria, $data)
    {
        try {
            $query = $this->db->prepare("UPDATE categorias SET nombre_categoria = :nombre_categoria, imagen_url = :imagen_url WHERE id_categoria = :id_categoria");
            $query->bindParam(':id_categoria', $id_categoria, PDO::PARAM_INT);
            $query->bindParam(':nombre_categoria', $data['nombre_categoria']);
            $query->bindParam(':imagen_url', $data['imagen_url']);
            $query->execute();
            http_response_code(200);
            echo json_encode(['message' => 'Categoría actualizada exitosamente']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar categoría: ' . $e->getMessage()]);
        }
    }

    function deleteCategoria($id_categoria)
    {
        try {
            $query = $this->db->prepare("DELETE FROM categorias WHERE id_categoria = :id_categoria");
            $query->bindParam(':id_categoria', $id_categoria, PDO::PARAM_INT);
            $query->execute();
            http_response_code(200);
            echo json_encode(['message' => 'Categoría eliminada exitosamente']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar categoría: ' . $e->getMessage()]);
        }
    }
}
$api = new API();
$api->handleRequest();
