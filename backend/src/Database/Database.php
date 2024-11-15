<?php

namespace App\Database;

use PDOException;

class Database {
    public static function connect() {
        try{
            $pdo = new \PDO("mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8", "{$_ENV['DB_USER']}", "{$_ENV['DB_PASS']}");
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            return $pdo;
        }
        catch(PDOException $e){
            return json_encode(["message" => "Erreur lors de la connexion avec la BdD", "PDO" => $e]);
        }
        
    }
}
