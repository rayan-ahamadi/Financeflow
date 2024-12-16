<?php

namespace App\Models;

class Utilisateurs {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
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
