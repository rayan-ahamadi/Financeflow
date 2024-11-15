<?php
namespace App\Controllers;

use App\Models\Transaction;
use App\Database\Database;

class TransactionController {
    private $transactionModel;

    public function __construct() {
        $pdo = Database::connect();
        $this->transactionModel = new Transaction($pdo);
    }

    public function getAllTransaction(){
        $transactions = $this->transactionModel->getAll();
        if ($transactions || $transactions === []) {
            http_response_code(201);
            echo $transactions === [] ? json_encode(["message" => "La table est vide"]) : json_encode($transactions);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erreur lors de la récupération des transactions"]);
        }
    }

    public function addTransaction($data){
        if ($data === null) {
            http_response_code(400); // Mauvaise requête
            echo json_encode(["message" => "Invalid JSON"]);
            exit;
        }

        $addTransactions = $this->transactionModel->add($data);
        if ($addTransactions) {
            http_response_code(201);
            echo json_encode(["message" => "La transaction a été ajouté avec succès"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erreur lors de l'ajout d'une transaction"]);
        }

    }
}
