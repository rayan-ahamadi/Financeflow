<?php

namespace App;

class Database {
    public static function connect() {
        return new \PDO("mysql:host=localhost:3306;dbname=finance_flow", "rayan", "qxd8enkm");
    }
}
