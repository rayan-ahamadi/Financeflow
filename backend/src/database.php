<?php

namespace App;

class Database {
    public static function connect() {
        return new \PDO("mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']}", "{$_ENV['DB_USER']}", "{$_ENV['DB_PASS']}");
    }
}
