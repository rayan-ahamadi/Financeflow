<?php

namespace App\Models;

use PDOException;

class Transaction {
    private $pdo;

    public function __construct($pdo) {
        // intéragit avec la BD
        $this->pdo = $pdo;
    }

    public function add($data){
        $title = $data['title'] ?? null;
        $typeTransaction = $data['type_transaction'] ?? null;
        $amount = $data['amount'] ?? null;
        $date = $data['date'] ?? null;
        $place = $data['place'] ?? null;
        $currency_code = $data['currency_code'] ?? null;
        $currency_symbol = $data['currency_symbol'] ?? null;
        $idUser = $data['id_user'] ?? null;
        $categoryList = $data['list_category'] ?? null;

        // Validation des données
        if (!$title || !$typeTransaction || !$amount || !$date || !$place || !$currency_code || !$currency_symbol || !$idUser || !$categoryList) {
            http_response_code(422); // Données non valides
            echo json_encode(["message" => "Données non valides"]);
            exit;
        }

        //Ajouter la nouvelle transaction
        try{
            $stmt = $this->pdo->prepare("INSERT INTO transaction (titre,type_transaction,amount,date,place,currency_code,currency_symbol,id_user) VALUES (?,?,?,?,?,?,?,?)");
            $stmt->execute([
                $title,
                $typeTransaction,
                $amount,
                $date,
                $place,
                $currency_code,
                $currency_symbol,
                $idUser
            ]);
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors de l'ajout de la transaction", "PDO" => $e]);
        }

        // Récuperer l'id de la transaction ajouté
        try{ 
            $stmt2 = $this->pdo->prepare("SELECT id_transaction FROM transaction ORDER BY id_transaction DESC LIMIT 1 WHERE id_user = ?");
            $stmt2->execute();
            $lastTransactionId = $stmt2->fetchAll()[0];
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors la récupération de la dernière transaction" , "PDO" => $e]);
        }

        // Ajout des catégories pour cette transaction
        try{
            // La liste de catégories est censé avoir une liste d'id venant de la table catégorie
            foreach($categoryList as &$category){
                $stmtCategory = $this->pdo->prepare("INSERT INTO Transactions_Categories (id_transaction,id_category) VALUES (?,?)");
                $stmtCategory->execute([
                    $lastTransactionId['id_transaction'],
                    $category
                ]);
            }
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors l'ajout des catégories dans la transaction", "PDO" => $e]);
        }
        

        
    }

    public function getAll(){
        $stmt = $this->pdo->prepare("SELECT * FROM transaction");
        $stmt->execute();
        return $stmt->fetchAll();
    }
}