<?php

use App\Controllers\TransactionController;
require __DIR__ . '/../../vendor/autoload.php';

// Fonction qui va servir au routage
function route($uri, $method) {
    // Les routes pour la table transaction
    if ($uri === '/api/transactions' && $method === 'POST') {
        // Ajout d'une transaction
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);

        $transaction = new TransactionController();
        $transaction->addTransaction($data);
    }
    else if ($uri === '/api/transactions' && $method === 'GET'){
        // Récupération de toutes les transactions
        $transaction = new TransactionController();
        $transaction->getAllTransaction();
    }
    else if (preg_match('#^/api/transactions/user/(\d+)$#', $uri, $matches) && $method === 'GET') {
        // Récupération de toutes les transactions d'un utilisateur
        $id_user = $matches[1]; // Capture l'id_user depuis l'URL
        $transaction = new TransactionController();
        $transaction->getAllFromUserId($id_user);
    }    
    else if (preg_match('#^/api/transactions/(\d+)$#', $uri, $matches)) { 
        //Gère les Urls ayant un id après transactions
        $id = $matches[1]; // Capture l'ID depuis l'URL
        
        if ($method === 'GET') {
            // Récupération d'une transaction par son ID
            $transaction = new TransactionController();
            $transaction->getTransactionById($id);
        } 
        else if ($method === 'PUT') {
            // Modification d'une transaction par son ID
            $json = file_get_contents("php://input");
            $data = json_decode($json, true);

            $transaction = new TransactionController();
            $transaction->updateTransaction($id, $data);
        } 
        else if ($method === 'DELETE') {
            // Suppression d'une transaction par son ID
            $transaction = new TransactionController();
            $transaction->deleteTransaction($id);
        }
    } 
    // Ajouter d'autres routes ici avec else if
}
