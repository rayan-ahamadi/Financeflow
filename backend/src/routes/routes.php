<?php

use App\Controllers\TransactionController;
require __DIR__ . '/../../vendor/autoload.php';

// Fonction qui va servir au routage
function route($uri, $method) {
    if ($uri === '/api/transactions' && $method === 'POST') {
        $json = file_get_contents("php://input");
        // Décoder le JSON en tableau associatif
        $data = json_decode($json, true);

        $transaction = new TransactionController();
        $transaction->addTransaction($data);
    }
    else if ($uri === '/api/transactions' && $method === 'GET'){
        // redirige vers la méthode du controlleur
        $transaction = new TransactionController();
        $transaction->getAllTransaction();
    }
    else if (preg_match('#^/api/transactions/(\d+)$#', $uri, $matches)) { //Gère les Urls ayant un id après transactions
        $id = $matches[1]; // Capture l'ID depuis l'URL
        
        if ($method === 'GET') {
            $transaction = new TransactionController();
            $transaction->getTransactionById($id);
        } 
        else if ($method === 'PUT') {
            $json = file_get_contents("php://input");
            $data = json_decode($json, true);

            $transaction = new TransactionController();
            $transaction->updateTransaction($id, $data);
        } 
        else if ($method === 'DELETE') {
            $transaction = new TransactionController();
            $transaction->deleteTransaction($id);
        }
    } 
    // Ajouter d'autres routes ici avec else if
}
