<?php

namespace App\Models;
use App\Helpers\JWTService;


class Utilisateurs {
    private $pdo;
    private $jwtService;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->jwtService = new JWTService();
    }

    public function login($username,$password){
        $user = $this->authenticate($username,$password);
        if ($user) {
            $payload = [
                "id_user" => $user['id'],
                "iat" => time(),
                "exp" => time() + 60 * 60
            ];
            $token = $this->jwtService->generateToken($payload);
            return $token;
        }
    }


    public function authenticate($username,$password){
        $stmt = $this->pdo->prepare('SELECT * FROM user WHERE username = :username');
        $stmt->bindParam(':username', $username, \PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Si le mot de passe correspond, retourner les infos de l'utilisateur
            return $user;
        }
        return false;
    }

    public function getAllUtilisateurs(){
        $query = $this->pdo->query("SELECT * FROM utilisateurs");
        return $query->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getUtilisateurById($id){
        $stmt = $this->pdo->prepare("SELECT * FROM utilisateurs WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function createUtilisateur($username, $password, $name, $surname) {
        $password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare("INSERT INTO utilisateurs (username, password, name, surname) VALUES (?,?,?,?)");
        $stmt->execute([$username, $password, $name, $surname]);
        return true;
    }

    public function updateUtilisateur($id, $username, $password, $name, $surname) {
        $stmt = $this->pdo->prepare("UPDATE utilisateurs SET username = ?, password = ?, name = ?, surname = ? WHERE id = ?");
        $stmt->execute([$username, $password, $name, $surname, $id]);
        return true;
    }

    public function deleteUtilisateur($id) {
        $stmt = $this->pdo->prepare("DELETE FROM utilisateurs WHERE id = ?");
        $stmt->execute([$id]);
        return true;
    }
}
