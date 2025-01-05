<?php

use App\Controllers\TransactionController;
use App\Controllers\UtilisateursController;
use App\Controllers\CategorieController;
use App\Middlewares\AuthMiddleware;

require __DIR__ . '/../../vendor/autoload.php';

// Fonction qui va servir au routage
function route($uri, $method)
{
    // Les routes pour la table transaction
    if ($uri === '/api/transactions' && $method === 'POST') {
        // Vérifie si l'utilisateur est authentifié
        AuthMiddleware::ensureAuthenticated();
        // Ajout d'une transaction
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);

        $transaction = new TransactionController();
        $transaction->addTransaction($data);
    } else if ($uri === '/api/transactions' && $method === 'GET') {
        AuthMiddleware::ensureAuthenticated();
        // Redirige vers la méthode du contrôleur
        $transaction = new TransactionController();
        $transaction->getAllTransaction();
    } else if (preg_match('#^/api/transactions/user/(\d+)$#', $uri, $matches) && $method === 'GET') {
        AuthMiddleware::ensureAuthenticated();
        // Récupération de toutes les transactions d'un utilisateur
        $id_user = $matches[1]; // Capture l'id_user depuis l'URL
        $transaction = new TransactionController();
        $transaction->getAllFromUserId($id_user);
    } else if (preg_match('#^/api/transactions/(\d+)$#', $uri, $matches)) {
        AuthMiddleware::ensureAuthenticated();
        //Gère les Urls ayant un id après transactions
        $id = (int) $matches[1]; // Capture l'ID depuis l'URL

        if ($method === 'GET') {

            // Récupération d'une transaction par son ID
            $transaction = new TransactionController();
            $transaction->getTransactionById($id);
        } else if ($method === 'PUT') {

            // Modification d'une transaction par son ID
            $json = file_get_contents("php://input");
            $data = json_decode($json, true);

            $transaction = new TransactionController();
            $transaction->updateTransaction($id, $data);
        } else if ($method === 'DELETE') {

            // Suppression d'une transaction par son ID
            $transaction = new TransactionController();
            $transaction->deleteTransaction($id);
        }
    }
    // Les routes pour la table utilisateurs
    else if ($uri === '/api/utilisateurs' && $method === 'GET') {
        AuthMiddleware::ensureAuthenticated();
        // Récupère tous les utilisateurs
        $utilisateurs = new UtilisateursController();
        $utilisateurs->index();
    } else if ($uri === '/api/utilisateurs/signup' && $method === 'POST') {
        // Création d'un utilisateur
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);

        $utilisateurs = new UtilisateursController();
        $utilisateurs->signup($data);
    } else if ($uri === '/api/utilisateurs/login' && $method === 'POST') {
        // Authentification d'un utilisateur
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);

        $utilisateurs = new UtilisateursController();
        $utilisateurs->login($data);
    } else if (preg_match('#^/api/utilisateurs/(\d+)$#', $uri, $matches)) {
        AuthMiddleware::ensureAuthenticated();
        // Gère les URLs ayant un ID après utilisateurs
        $id = (int) $matches[1]; // Capture l'ID depuis l'URL

        if ($method === 'GET') {
            // Récupération d'un utilisateur par son ID
            $utilisateurs = new UtilisateursController();
            $utilisateurs->getUser($id);
        } else if ($method === 'PUT') {
            // Modification d'un utilisateur par son ID
            $json = file_get_contents("php://input");
            $data = json_decode($json, true);

            $utilisateurs = new UtilisateursController();
            $utilisateurs->update($id, $data);
        } else if ($method === 'DELETE') {
            // Suppression d'un utilisateur par son ID
            $utilisateurs = new UtilisateursController();
            $utilisateurs->delete($id);
        }
    }
    // Les routes pour la table catégories
    else if ($uri === '/api/categories' && $method === 'GET') {
        AuthMiddleware::ensureAuthenticated();
        // Récupère catégories et sous-catégories
        $categorie = new CategorieController();
        $categorie->getAll();
    } else if ($uri === "/api/categories/parents" && $method === 'GET') {
        AuthMiddleware::ensureAuthenticated();
        // Récupère les catégories parentes
        $categorie = new CategorieController();
        $categorie->getParents();
    } else if (preg_match("/^\/api\/categories\/parents-child\/(\d+)$/", $uri, $matches) && $method === 'GET') {
        AuthMiddleware::ensureAuthenticated();
        // Récupère les sous-catégories d'une catégorie parente 
        $id = (int) $matches[1]; // Capture l'ID depuis l'URL
        $categorie = new CategorieController();
        $categorie->getChildren($id);
    }
    // Ajouter d'autres routes ici avec else if
}
