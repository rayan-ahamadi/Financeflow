<?php

namespace App\Middlewares;

use App\Helpers\JWTService;

class AuthMiddleware
{
    public static function ensureAuthenticated()
    {   

        // Récupération des headers et vérification de l'existence du token
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
            if (JWTService::validateToken($token)) {
                return true;
            }
        }
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
}
