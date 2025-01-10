<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
    header('Access-Control-Max-Age: 86400'); // Cache de preflight
    exit(0);
}

header('Access-Control-Allow-Origin: http://localhost:3000'); // Cambiar * por la URL específica
header('Access-Control-Allow-Credentials: true'); // Permitir credenciales
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
}

$api = new API();
$api->handleRequest();
