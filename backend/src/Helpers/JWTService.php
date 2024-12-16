<?php

namespace App\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTService
{
    private static $secretKey;
    private static $algorithm;

    public function __construct()
    {
      $this->secretKey = $_ENV['JWT_SECRET'];
      $this->algorithm = 'HS256';
    }


    public static function generateToken(array $payload): string
    {
        return JWT::encode($payload, self::$secretKey, self::$algorithm);
    }

    public static function decodeToken(string $jwt): object
    {
        return JWT::decode($jwt, new Key(self::$secretKey, self::$algorithm));
    }

    public static function validateToken(string $jwt): bool
    {
        try {
            JWT::decode($jwt, new Key(self::$secretKey, self::$algorithm));
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
