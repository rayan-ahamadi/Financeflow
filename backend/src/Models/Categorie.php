<?php 

namespace App\Models;
use PDOException;

class Categorie {
    private $pdo;

    public function __construct($pdo) {
        // intéragit avec la BD
        $this->pdo = $pdo;
    }

    public function getAll(){
        try {
            $sql = "SELECT * FROM categories";
            $stmt = $this->pdo->query($sql);
            $categories = $stmt->fetchAll();
            return $categories;
        } catch (PDOException $e) {
            echo json_encode(["message" => "Erreur lors de la récupération des catégories", "PDO" => $e->getMessage()]);
            exit;
        }
    }

    public function getParents(){
        try {
            $sql = "SELECT * FROM categories WHERE parent_id IS NULL";
            $stmt = $this->pdo->query($sql);
            $categories = $stmt->fetchAll();
            return $categories;
        } catch (PDOException $e) {
            echo json_encode(["message" => "Erreur lors de la récupération des catégories parents", "PDO" => $e->getMessage()]);
            exit;
        }
    }

    public function getChildren($id){
        try {
            $sql = "SELECT * FROM categories WHERE parent_id = :id";
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