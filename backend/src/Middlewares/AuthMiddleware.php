<?php

namespace App\Middlewares;

use App\Helpers\JWTService;

class AuthMiddleware
{
    public static function ensureAuthenticated()
    {
        // Récupération des en-têtes
        $headers = function_exists('getallheaders') ? getallheaders() : apache_request_headers();

        // Alternative avec $_SERVER si les en-têtes ne sont pas accessibles
        if (!isset($headers['Authorization']) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
        }

        // Vérification de la présence du token
        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
            if (JWTService::validateToken($token)) {
                return true;
            }
        }

        // Réponse en cas d'erreur
        http_response_code(401);
        echo json_encode([
            'error' => 'Unauthorized',
            'received_headers' => $headers, // Pour déboguer
        ]);
        exit();
    }
}
