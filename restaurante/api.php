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
                    if (isset($request[1])) {
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
                    echo json_encode(array('error' => 'Método no permitido'));
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


            default:
                http_response_code(404);
                echo json_encode(array('error' => 'Ruta no encontrada'));
        }
    }

    function getAllRestaurantes()
    {
        $query = $this->db->prepare("SELECT * FROM restaurantes");
        $query->execute();
        $restaurantes = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($restaurantes);
    }

    function getRestaurante($id)
    {
        $query = $this->db->prepare("SELECT * FROM restaurantes WHERE id_restaurante = :id");
        $query->bindParam(':id', $id);
        $query->execute();
        $restaurante = $query->fetch(PDO::FETCH_ASSOC);
        if ($restaurante) {
            http_response_code(200);
            echo json_encode($restaurante);
        } else {
            http_response_code(404);
            echo json_encode(array('error' => 'El restaurante no existe'));
        }
    }

    function createRestaurante($data)
    {
        try {
            $query = $this->db->prepare("INSERT INTO restaurantes (nombre, ubicacion, categoria, horario_apertura, horario_cierre, descripcion) VALUES (:nombre, :ubicacion, :categoria, :horario_apertura, :horario_cierre, :descripcion)");
            $query->bindParam(':nombre', $data['nombre']);
            $query->bindParam(':ubicacion', $data['ubicacion']);
            $query->bindParam(':categoria', $data['categoria']);
            $query->bindParam(':horario_apertura', $data['horario_apertura']);
            $query->bindParam(':horario_cierre', $data['horario_cierre']);
            $query->bindParam(':descripcion', $data['descripcion']);
            if ($query->execute()) {
                http_response_code(201);
                echo json_encode(array('message' => 'Restaurante creado'));
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(array('error' => 'Error al crear restaurante: ' . $e->getMessage()));
        }
    }

    function updateRestaurante($id, $data)
    {
        $query = $this->db->prepare("UPDATE restaurantes SET nombre = :nombre, ubicacion = :ubicacion, categoria = :categoria, horario_apertura = :horario_apertura, horario_cierre = :horario_cierre, descripcion = :descripcion WHERE id_restaurante = :id");
        $query->bindParam(':id', $id, PDO::PARAM_INT);
        $query->bindParam(':nombre', $data['nombre']);
        $query->bindParam(':ubicacion', $data['ubicacion']);
        $query->bindParam(':categoria', $data['categoria']);
        $query->bindParam(':horario_apertura', $data['horario_apertura']);
        $query->bindParam(':horario_cierre', $data['horario_cierre']);
        $query->bindParam(':descripcion', $data['descripcion']);
        if ($query->execute()) {
            http_response_code(200);
            echo json_encode(array('message' => 'Restaurante actualizado'));
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
}

$api = new API();
$api->handleRequest();
