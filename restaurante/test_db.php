<?php
$dsn = 'mysql:host=localhost;dbname=restaurantesreservas';
$username = 'root'; // Cambiar si tu usuario es diferente
$password = '';

try {
    $db = new PDO($dsn, $username, $password);
    $db->exec("set names utf8");
    echo "Conexión exitosa a la base de datos.";
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
}
?>
