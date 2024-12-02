<?php 

namespace App\Controllers;

use App\Models\Categorie;
use App\Database\Database;

class CategorieController{
    private $categorieModel;
    
    public function __construct() {
        $pdo = Database::connect();
        $this->categorieModel = new Categorie($pdo);
    }

    public function getAll() : void {
        $categories = $this->categorieModel->getAll();
        echo json_encode($categories);
    }

    public function getParents() : void {
        $categories = $this->categorieModel->getParents();
        echo json_encode($categories);
    }

    public function getChildren(int $id) : void {
        $categories = $this->categorieModel->getChildren($id);
        echo json_encode($categories);
    }

}