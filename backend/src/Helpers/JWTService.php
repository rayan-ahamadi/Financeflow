<?php

namespace App\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTService
{
    
  private static $secretKey;
  private static $algorithm = 'HS256';

  // Fonnction statique d'initialisation de la clé secrète
  public static function init()
  {
      if (!self::$secretKey) {
          self::$secretKey = (string) $_ENV['JWT_SECRET'] ?? 'default_secret_key';
      }
  }

  public static function generateToken(array $payload): string
  {
      // Initialisation de la clé secrète
      self::init();
      return JWT::encode($payload, self::$secretKey, self::$algorithm);
  }

  public static function decodeToken(string $jwt): object
  {
      self::init();
      return JWT::decode($jwt, new Key(self::$secretKey, self::$algorithm));
  }

  public static function validateToken(string $jwt): bool
  {
      self::init();
      try {
          JWT::decode($jwt, new Key(self::$secretKey, self::$algorithm));
          return true;
      } catch (\Exception $e) {
          return false;
      }
  }
}
