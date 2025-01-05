<?php

// Point d'entrée de l'API REST

$domain = $_SERVER['SERVER_NAME'];

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . $domain . ':5173');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

header('Cache-Control: no-cache, no-store, must-revalidate'); // Pas de cache côté client
header('Expires: 0'); // Expire immédiatement
header('Pragma: no-cache'); // Compatibilité avec les navigateurs anciens

require '../src/routes/routes.php';
include __DIR__ . '/../vendor/autoload.php';


use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/../");
$dotenv->load();


$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

route($uri, $method);
