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
        include 'views/utilisateurs/index.php';
    }

    public function show($id) {
        $utilisateur = $this->utilisateursModel->getUtilisateurById($id);
        include 'views/utilisateurs/show.php';
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = $_POST['username'];
            $password = $_POST['password'];
            $name = $_POST['name'];
            $surname = $_POST['surname'];
            $this->utilisateursModel->createUtilisateur($username, $password, $name, $surname);
            header('Location: index.php?controller=utilisateurs&action=index');
        } else {
            include 'views/utilisateurs/create.php';
        }
    }

    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = $_POST['username'];
            $password = $_POST['password'];
            $name = $_POST['name'];
            $surname = $_POST['surname'];
            $this->utilisateursModel->updateUtilisateur($id, $username, $password, $name, $surname);
            header('Location: index.php?controller=utilisateurs&action=index');
        } else {
            $utilisateur = $this->utilisateursModel->getUtilisateurById($id);
            include 'views/utilisateurs/edit.php';
        }
    }

    public function delete($id) {
        $this->utilisateursModel->deleteUtilisateur($id);
        header('Location: index.php?controller=utilisateurs&action=index');
    }
}
