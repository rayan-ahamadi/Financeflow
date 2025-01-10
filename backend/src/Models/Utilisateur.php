<?php

namespace App\Models;

use App\Helpers\JWTService;



class Utilisateur
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    // Renvoie un token pour l'utilisateur existant
    public function login($username, $password)
    {
        // vérifier si l'utilisateur existe
        $user = $this->authenticate($username, $password);

        //retourner un token si l'utilisateur existe
        if ($user) {
            $payload = [
                "id_user" => $user['id_user'],
                "iat" => time(),
                "exp" => time() + 60 * 60
            ];
            $token = JWTService::generateToken($payload);
            return json_encode(["token" => $token, "message" => "Connexion reussie", "user_id" => $user['id_user']]);
        }
        return false;
    }

    // Vérifie si l'utilisateur existe et si le mot de passe est correct
    public function authenticate($email, $password)
    {
        try {
            $stmt = $this->pdo->prepare('SELECT * FROM user WHERE email = :email');
            $stmt->bindParam(':email', $email, \PDO::PARAM_STR);
            $stmt->execute();
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            // Si l'utilisateur existe, vérifier le mot de passe
            if ($user && password_verify($password, $user['password'])) {
                // Si le mot de passe correspond, retourner les infos de l'utilisateur
                return $user;
            } else {
                return false;
            }
        } catch (\PDOException $e) {
            return ["error_message" => $e->getMessage()];
        }

        return false;
    }

    public function getAllUtilisateurs()
    {
        try {
            $query = $this->pdo->query("SELECT * FROM user");
            return $query->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            return ["error_message" => $e->getMessage()];
        }
    }

    public function getUtilisateurById($id)
    {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM user WHERE id_user= ?");
            $stmt->execute([$id]);
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            return ["error_message" => $e->getMessage()];
        }
    }

    public function createUtilisateur($email, $password, $name, $surname, $role)
    {
        try {

            // Vérifier si l'utilisateur existe déjà
            $stmt = $this->pdo->prepare("SELECT * FROM user WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);
            if ($user) {
                return ["error_message" => "Cet utilisateur existe déjà."];
            }

            $password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $this->pdo->prepare("INSERT INTO user (email, password, name, surname, role) VALUES (?,?,?,?,?)");
            $stmt->execute([$email, $password, $name, $surname, $role]);
            return true;
        } catch (\PDOException $e) {
            return ["error_message" => $e->getMessage()];
        }
    }

    public function updateUtilisateur($id, $email, $password, $name, $surname)
    {
        try {
            $stmt = $this->pdo->prepare("UPDATE user SET email = ?, password = ?, name = ?, surname = ? WHERE id_user= ?");
            $stmt->execute([$email, $password, $name, $surname, $id]);
            return true;
        } catch (\PDOException $e) {
            return ["error_message" => $e->getMessage()];
        }
    }

    public function deleteUtilisateur($id)
    {
        try {
            // Supprimer les transactions_categories associées à l'utilisateur
            $stmt = $this->pdo->prepare("DELETE FROM transactions_categories WHERE id_transaction IN (SELECT id_transaction FROM transaction WHERE id_user = ?)");
            $stmt->execute([$id]);

            // Supprimer les transactions associées à l'utilisateur
            $stmt = $this->pdo->prepare("DELETE FROM transaction WHERE id_user = ?");
            $stmt->execute([$id]);

            // Supprimer l'utilisateur
            $stmt = $this->pdo->prepare("DELETE FROM user WHERE id_user= ?");
            $stmt->execute([$id]);
            return true;
        } catch (\PDOException $e) {
            return ["error_message" => $e->getMessage()];
        }
    }
}
