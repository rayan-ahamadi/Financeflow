<?php

namespace App\Models;

class Transaction {
    private $pdo;

    public function __construct($pdo) {
        // intéragit avec la BD
        $this->pdo = $pdo;
    }

    public function add($data) {
    //     $stmt = $this->pdo->prepare("INSERT INTO Transaction (type_transaction, montant, titre, date, lieu, id_user, id_categorie) VALUES (?, ?, ?, ?, ?, ?, ?)");
    //     return $stmt->execute([
    //         $data['type_transaction'],
    //         $data['montant'],
    //         $data['titre'],
    //         $data['date'],
    //         $data['lieu'] ?? null,
    //         $data['id_user'],
    //         $data['id_categorie']
    //     ]);
    }
}