<?php

use App\Controllers\TransactionController;

function route($uri, $method) {
    if ($uri === '/api/transactions' && $method === 'GET') {
        //méthode du controlleurs transactions
        echo "test";
    }
    // Ajouter d'autres routes ici
}
