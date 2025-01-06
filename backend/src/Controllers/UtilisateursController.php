<?php

namespace App\Controllers;

use App\Models\Utilisateur;
use App\Database\Database;

class UtilisateursController
{
    private $utilisateursModel;

    public function __construct()
    {
        $pdo = Database::connect();
        $this->utilisateursModel = new Utilisateur($pdo);
    }

    public function index()
    {
        $utilisateurs = $this->utilisateursModel->getAllUtilisateurs();
        echo json_encode($utilisateurs);
    }

    public function getUser($id)
    {
        $utilisateur = $this->utilisateursModel->getUtilisateurById($id);
        if ($utilisateur) {
            echo json_encode($utilisateur);
        } else {
            http_response_code(404);
            echo json_encode(["error_message" => "Utilisateur non trouvé"]);
        }
    }

    public function signup($data)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if ($data === null) {
                http_response_code(400);
                echo json_encode(["error_message" => "Invalid JSON"]);
                exit;
            }

            $email = $data['email'];
            $password = $data['password'];
            $name = $data['name'];
            $surname = $data['surname'];
            $role = $data['role'];
            $created = $this->utilisateursModel->createUtilisateur($email, $password, $name, $surname, $role);

            if (isset($created['error_message'])) {
                echo json_encode($created);
                exit;
            }

            if ($created) {
                http_response_code(201);
                $this->utilisateursModel->login($email, $password);
                echo json_encode([
                    "message" => "Utilisateur créé avec succès",
                    "token" => $this->utilisateursModel->login($email, $password)
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["error_message" => "Erreur lors de la création de l'utilisateur"]);
            }
        }
    }

    public function update($id)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data === null) {
                http_response_code(400);
                echo json_encode(["error_message" => "Invalid JSON"]);
                exit;
            }

            $email = $data['email'];
            $password = $data['password'];
            $name = $data['name'];
            $surname = $data['surname'];
            $updated = $this->utilisateursModel->updateUtilisateur($id, $email, $password, $name, $surname);

            if ($updated) {
                echo json_encode(["message" => "Utilisateur mis à jour avec succès"]);
            } else {
                http_response_code(500);
                echo json_encode(["error_message" => "Erreur lors de la mise à jour de l'utilisateur"]);
            }
        } else {
            $utilisateur = $this->utilisateursModel->getUtilisateurById($id);
            if ($utilisateur) {
                echo json_encode($utilisateur);
            } else {
                http_response_code(404);
                echo json_encode(["error_message" => "Utilisateur non trouvé"]);
            }
        }
    }

    public function delete($id)
    {
        $deleted = $this->utilisateursModel->deleteUtilisateur($id);
        if ($deleted) {
            echo json_encode(["message" => "Utilisateur supprimé avec succès"]);
        } else {
            http_response_code(500);
            echo json_encode(["error_message" => "Erreur lors de la suppression de l'utilisateur"]);
        }
    }

    public function login($data)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if ($data === null) {
                http_response_code(400);
                echo json_encode(["error_message" => "Invalid JSON"]);
                exit;
            }

            $email = $data['email'];
            $password = $data['password'];

            $userToken = $this->utilisateursModel->login($email, $password);

            if (isset($userToken['error_message'])) {
                http_response_code(401);
            }

            // Vérifie si l'utilisateur existe et retourne un token JWT
            echo $userToken ? $userToken : json_encode(["error_message" => "E-mail ou mot de passe incorrect."]);
        }
    }
}
