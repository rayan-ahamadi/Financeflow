<?php 

namespace App\Models;
use PDOException;

class Categorie {
    private $pdo;

    public function __construct($pdo) {
        // intéragit avec la BD
        $this->pdo = $pdo;
    }

    public function getAll() : array {
        try {
            $sql = "SELECT * FROM category";
            $stmt = $this->pdo->query($sql);
            $categories = $stmt->fetchAll();
            return $categories;
        } catch (PDOException $e) {
            echo json_encode(["message" => "Erreur lors de la récupération des catégories", "PDO" => $e->getMessage()]);
            exit;
        }
    }

    public function getParents() : array {
        try {
            $sql = "SELECT * FROM category WHERE parent_id IS NULL";
            $stmt = $this->pdo->query($sql);
            $categories = $stmt->fetchAll();
            return $categories;
        } catch (PDOException $e) {
            echo json_encode(["message" => "Erreur lors de la récupération des catégories parents", "PDO" => $e->getMessage()]);
            exit;
        }
    }

    public function getChildren(int $id) : array {
        try {
            $sql = "SELECT * FROM category WHERE parent_id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $categories = $stmt->fetchAll();
            return $categories;
        } catch (PDOException $e) {
            echo json_encode(["message" => "Erreur lors de la récupération des catégories enfants", "PDO" => $e->getMessage()]);
            exit;
        }
    }

}