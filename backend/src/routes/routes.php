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
    // Ajouter d'autres routes ici avec else if
}
