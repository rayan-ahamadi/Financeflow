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


    public function authenticate($email, $password)
    {
        //Vérifier l'existence de l'user avec le mail
        $stmt = $this->pdo->prepare('SELECT * FROM user WHERE email = :email');
        $stmt->bindParam(':email', $email, \PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        // Si l'utilisateur existe, vérifier le mot de passe
        if ($user && password_verify($password, $user['password'])) {
            // Si le mot de passe correspond, retourner les infos de l'utilisateur
            return $user;
        }
        return false;
    }

    public function getAllUtilisateurs()
    {
        $query = $this->pdo->query("SELECT * FROM user ");
        return $query->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getUtilisateurById($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM user WHERE user_id= ?");
        $stmt->execute([$id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function createUtilisateur($email, $password, $name, $surname, $role)
    {
        $password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare("INSERT INTO user (email, password, name, surname,role) VALUES (?,?,?,?,?)");
        $stmt->execute([$email, $password, $name, $surname, $role]);
        return true;
    }

    public function updateUtilisateur($id, $email, $password, $name, $surname)
    {
        $stmt = $this->pdo->prepare("UPDATE user SET email = ?, password = ?, name = ?, surname = ? WHERE id_user= ?");
        $stmt->execute([$email, $password, $name, $surname, $id]);
        return true;
    }

    public function deleteUtilisateur($id)
    {
        // Supprimer les transactions_categories associées à l'utilisateur
        $stmt = $this->pdo->prepare("DELETE FROM transactions_categories WHERE id_transaction IN (SELECT id_transaction FROM transaction WHERE id_user = ?)");
        $stmt->execute([$id]);

        // Supprimer les transactions associées à l'utilisateur
        $stmt = $this->pdo->prepare("DELETE FROM transaction WHERE id_user = ?");
        $stmt->execute([$id]);


        $stmt = $this->pdo->prepare("DELETE FROM user WHERE id_user= ?");
        $stmt->execute([$id]);
        return true;
    }
}
