<?php


namespace App\Controllers;

use App\Database;
use App\Models\Transaction;

class TransactionController {
    private $transactionModel;

    public function __construct() {
        $pdo = Database::connect();
        $this->transactionModel = new Transaction($pdo);
    }

    public function addTransaction() {
        // récupère données de la requêtes
        $data = json_decode(file_get_contents("php://input"), true);

        // Et appelle la méthode correspondante du model avec les paramètres de la requête
        if ($this->transactionModel->add($data)) {
            http_response_code(201);
            echo json_encode(["message" => "Transaction ajoutée avec succès."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erreur lors de l'ajout de la transaction."]);
        }
    }
}
