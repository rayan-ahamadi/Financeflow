<?php

namespace App\Controllers;

use App\Models\Utilisateurs;
use App\Database\Database;

class UtilisateursController {
    private $utilisateursModel;

    public function __construct() {
        $pdo = Database::connect();
        $this->utilisateursModel = new Utilisateurs($pdo);
    }

    public function index() {
        $utilisateurs = $this->utilisateursModel->getAllUtilisateurs();
        echo json_encode($utilisateurs);
    }

    public function show($id) {
        $utilisateur = $this->utilisateursModel->getUtilisateurById($id);
        if ($utilisateur) {
            echo json_encode($utilisateur);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Utilisateur non trouvé"]);
        }
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data === null) {
                http_response_code(400);
                echo json_encode(["message" => "Invalid JSON"]);
                exit;
            }

            $username = $data['username'];
            $password = $data['password'];
            $name = $data['name'];
            $surname = $data['surname'];
            $created = $this->utilisateursModel->createUtilisateur($username, $password, $name, $surname);

            if ($created) {
                http_response_code(201);
                echo json_encode(["message" => "Utilisateur créé avec succès"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Erreur lors de la création de l'utilisateur"]);
            }
        }
    }

    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data === null) {
                http_response_code(400);
                echo json_encode(["message" => "Invalid JSON"]);
                exit;
            }

            $username = $data['username'];
            $password = $data['password'];
            $name = $data['name'];
            $surname = $data['surname'];
            $updated = $this->utilisateursModel->updateUtilisateur($id, $username, $password, $name, $surname);

            if ($updated) {
                echo json_encode(["message" => "Utilisateur mis à jour avec succès"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Erreur lors de la mise à jour de l'utilisateur"]);
            }
        } else {
            $utilisateur = $this->utilisateursModel->getUtilisateurById($id);
            if ($utilisateur) {
                echo json_encode($utilisateur);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Utilisateur non trouvé"]);
            }
        }
    }

    public function delete($id) {
        $deleted = $this->utilisateursModel->deleteUtilisateur($id);
        if ($deleted) {
            echo json_encode(["message" => "Utilisateur supprimé avec succès"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erreur lors de la suppression de l'utilisateur"]);
        }
    }
}
