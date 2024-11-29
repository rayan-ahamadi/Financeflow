<?php

use App\Controllers\TransactionController;
use App\Controllers\UtilisateursController;
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
        // Redirige vers la méthode du contrôleur
        $transaction = new TransactionController();
        $transaction->getAllTransaction();
    }
    else if ($uri === '/api/transactions' && $method === 'DELETE') {
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);
        $transactionId = $data['id'] ?? null;

        if ($transactionId) {
            $transaction = new TransactionController();
            $transaction->deleteTransaction($transactionId);
        } else {
            echo json_encode(['error' => 'Transaction ID is required']);
        }
    }
    else if ($uri === '/api/utilisateurs' && $method === 'GET') {
        $utilisateurs = new UtilisateursController();
        $utilisateurs->getAllUtilisateurs();
    }
    else if ($uri === '/api/utilisateurs' && $method === 'POST') {
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);

        $utilisateurs = new UtilisateursController();
        $utilisateurs->createUtilisateur($data);
    }
    // Ajouter d'autres routes ici avec else if
}
