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
            $stmt = $this->pdo->prepare("INSERT INTO transaction (title,type_transaction,amount,date,place,currency_code,currency_symbol,id_user) VALUES (:title,:type_transaction,:amount,:date,:place,:currency_code,:currency_symbol,:id_user)");
            $stmt->bindParam(':title', $title, \PDO::PARAM_STR);
            $stmt->bindParam(':type_transaction', $typeTransaction, \PDO::PARAM_STR);
            $stmt->bindParam(':amount', $amount, \PDO::PARAM_STR);
            $stmt->bindParam(':date', $date, \PDO::PARAM_STR);
            $stmt->bindParam(':place', $place, \PDO::PARAM_STR);
            $stmt->bindParam(':currency_code', $currency_code, \PDO::PARAM_STR);    
            $stmt->bindParam(':currency_symbol', $currency_symbol, \PDO::PARAM_STR);
            $stmt->bindParam(':id_user', $idUser, \PDO::PARAM_INT);
            $stmt->execute();
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors de l'ajout de la transaction", "PDO" => $e]);
            exit;
        }

        // Récuperer l'id de la transaction ajouté
        try{ 
            $stmt2 = $this->pdo->prepare("SELECT id_transaction FROM transaction WHERE id_user = :id_user ORDER BY id_transaction DESC LIMIT 1 ");
            $stmt2->bindParam(':id_user', $idUser, \PDO::PARAM_INT); ;
            $stmt2->execute();
            $lastTransactionId = $stmt2->fetchAll(\PDO::FETCH_ASSOC)[0];
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors la récupération de la dernière transaction" , "PDO" => $e]);
            exit;
        }

        // Modifier le solde de l'utilisateur
        try{
            $stmt3 = $this->pdo->prepare("SELECT balance FROM user WHERE id_user = :id_user");
            $stmt3->bindParam(':id_user', $idUser, \PDO::PARAM_INT);
            $stmt3->execute();
            $balance = $stmt3->fetchAll(\PDO::FETCH_ASSOC)[0]["balance"];

            if ($typeTransaction === "revenu"){
                $balance += $amount;
            }
            else {
                $balance -= $amount;
            }

            $stmt4 = $this->pdo->prepare("UPDATE user SET balance = :balance WHERE id_user = :id_user");
            $stmt4->bindParam(':balance', $balance, \PDO::PARAM_STR);
            $stmt4->bindParam(':id_user', $idUser, \PDO::PARAM_INT);
            $stmt4->execute();
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors de la modification du solde de l'utilisateur", "PDO" => $e, "balance" => $stmt4->fetchAll(\PDO::FETCH_ASSOC)]);
            exit;
        }

        // Ajout des catégories pour cette transaction
        try{
            // La liste de catégories est censé avoir une liste d'id venant de la table catégorie
            foreach($categoryList as &$category){
                $stmtCategory = $this->pdo->prepare("INSERT INTO transactions_categories (id_transaction,id_category) VALUES (:id_transaction,:id_category)");
                $stmtCategory->bindParam(':id_transaction', $lastTransactionId['id_transaction'], \PDO::PARAM_INT);
                $stmtCategory->bindParam(':id_category', $category, \PDO::PARAM_INT);
                $stmtCategory->execute();
            }
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors l'ajout des catégories dans la transaction", "PDO" => $e]);
            exit;
        }
        
        return true;

        
    }

    public function getAll(){
        try{
            // Prendre les transactions
            $stmt = $this->pdo->prepare("SELECT * FROM transaction");
            $stmt->execute();
            $resultTransactions = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            // Prendre leurs catégories
            $stmtCategory = $this->pdo->prepare("SELECT id_transaction,name_category, parent_id FROM transactions_categories INNER JOIN category ON category.id_category = transactions_categories.id_category");
            $stmtCategory->execute();
            $categories = $stmtCategory->fetchAll(\PDO::FETCH_ASSOC);

            foreach($resultTransactions as &$transaction){
                $transaction["list_category"] = [
                    "category" => "",
                    "subcategories" => []
                ];

                /* Parcourir toutes les catégories des transactions pour trouver 
                les catégories liés à la &$transaction */
                foreach($categories as &$category){
                    if ($category["id_transaction"] === $transaction["id_transaction"]){
                        // On vérifie si la catégorie est une sous-catégorie
                        if (!$category["parent_id"]){
                            $transaction["list_category"]["category"] = $category["name_category"];
                        }
                        else {
                            array_push($transaction["list_category"]["subcategories"], $category["name_category"]);
                        }
                    }
                }

            }

            return $resultTransactions;
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors de la récupération des transactions", "PDO" => $e]);
            exit;
        }
        
    }

    public function getAllFromUser($id_user){
        try{
            // Prendre les transactions de l'utilisateur
            $stmt = $this->pdo->prepare("SELECT * FROM transaction WHERE id_user = :id_user");
            $stmt->bindParam(':id_user', $id_user, \PDO::PARAM_INT);
            $stmt->execute();
            $resultTransactions = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            // Prendre leurs catégories
            $stmtCategory = $this->pdo->prepare("SELECT id_transaction,name_category, parent_id FROM transactions_categories INNER JOIN category ON category.id_category = transactions_categories.id_category");
            $stmtCategory->execute();
            $categories = $stmtCategory->fetchAll(\PDO::FETCH_ASSOC);

            foreach($resultTransactions as &$transaction){
                $transaction["list_category"] = [
                    "category" => "",
                    "subcategories" => []
                ];

                /* Parcourir toutes les catégories des transactions pour trouver 
                les catégories liés à la &$transaction */
                foreach($categories as &$category){
                    if ($category["id_transaction"] === $transaction["id_transaction"]){
                        // On vérifie si la catégorie est une sous-catégorie
                        if (!$category["parent_id"]){
                            $transaction["list_category"]["category"] = $category["name_category"];
                        }
                        else {
                            array_push($transaction["list_category"]["subcategories"], $category["name_category"]);
                        }
                    }
                }

            }

            return $resultTransactions;
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors de la récupération des transactions de l'utilisateur", "PDO" => $e]);
            exit;
        }
    }

    public function delete($id){
        // supprimer les catégories de la transaction
        try{
            $stmtDelCat = $this->pdo->prepare("DELETE FROM transactions_categories WHERE id_transaction = :id_transaction");
            $stmtDelCat->bindParam(':id_transaction', $id, \PDO::PARAM_INT);
            $stmtDelCat->execute();
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors de la suppression des catégories", "PDO" => $e]);
            exit;
        }

        // supprimer la transaction de sa table
        try{
            $stmtTransaction = $this->pdo->prepare("DELETE FROM transaction WHERE id_transaction = :id_transaction");
            $stmtTransaction->bindParam(':id_transaction', $id, \PDO::PARAM_INT);
            $stmtTransaction->execute();
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors de la suppression de la transaction", "PDO" => $e]);
            exit;
        }

        return true;
    }

    public function update($id,$data){
        $title = $data['title'] ?? null;
        $typeTransaction = $data['type_transaction'] ?? null;
        $amount = $data['amount'] ?? null;
        $date = $data['date'] ?? null;
        $place = $data['place'] ?? null;
        $currency_code = $data['currency_code'] ?? null;
        $currency_symbol = $data['currency_symbol'] ?? null;
        $categoryList = $data['list_category'] ?? null;

        // Validation des données
        if (!$title || !$typeTransaction || !$amount || !$date || !$place || !$currency_code || !$currency_symbol  || !$categoryList) {
            http_response_code(422); // Données non valides
            echo json_encode(["message" => "Données non valides"]);
            exit;
        }

        try {
            //Modification dans la table transaction
            $stmtTransaction = $this->pdo->prepare("UPDATE transaction SET title = :title, type_transaction = :type_transaction, amount = :amount, date = :date,place = :place ,currency_code = :currency_code ,currency_symbol = :currency_symbol WHERE id_transaction = :id_transaction");
            $stmtTransaction->bindParam(':title', $title, \PDO::PARAM_STR);
            $stmtTransaction->bindParam(':type_transaction', $typeTransaction, \PDO::PARAM_STR);
            $stmtTransaction->bindParam(':amount', $amount, \PDO::PARAM_STR);
            $stmtTransaction->bindParam(':date', $date, \PDO::PARAM_STR);
            $stmtTransaction->bindParam(':place', $place, \PDO::PARAM_STR);
            $stmtTransaction->bindParam(':currency_code', $currency_code, \PDO::PARAM_STR);
            $stmtTransaction->bindParam(':currency_symbol', $currency_symbol, \PDO::PARAM_STR);
            $stmtTransaction->bindParam(':id_transaction', $id, \PDO::PARAM_INT);
            $stmtTransaction->execute();

        }
        catch(PDOException $e) {
            echo json_encode(["message" => "Erreur lors de la modification de la transaction", "PDO" => $e]);
            exit;
        }

        try{
            // Modification dans la table de jointure Transactions_Categories
            $stmtDelCat = $this->pdo->prepare("DELETE FROM transactions_categories WHERE id_transaction = :id_transaction");
            $stmtDelCat->bindParam(':id_transaction', $id, \PDO::PARAM_INT);
            $stmtDelCat->execute();

            foreach($categoryList as &$category){
                $stmtCategory = $this->pdo->prepare("INSERT INTO transactions_categories (id_transaction,id_category) VALUES (:id_transaction,:id_category)");
                $stmtCategory->bindParam(':id_transaction', $id, \PDO::PARAM_INT);
                $stmtCategory->bindParam(':id_category', $category, \PDO::PARAM_INT);
                $stmtCategory->execute();
            }
        }
        catch (PDOException $e) {
            echo json_encode(["message" => "Erreur lors de la modification des catégories", "PDO" => $e]);
            exit;
        }
            
        return true;
    }

    public function getById($id){
        try{
            //Récuperer la transaction
            $stmtTransaction = $this->pdo->prepare("SELECT * FROM transaction WHERE id_transaction = :id_transaction");
            $stmtTransaction->bindParam(':id_transaction', $id, \PDO::PARAM_INT);
            $stmtTransaction->execute();
            $result = $stmtTransaction->fetchAll(\PDO::FETCH_ASSOC)[0] ?? null;

            if(!$result){
                http_response_code(404); // Not found
                echo json_encode(["message" => "Transaction non trouvée"]);
                exit;
            }

            // Récuperer ses catégories
            $stmtCategory = $this->pdo->prepare("SELECT name_category, parent_id FROM transactions_categories INNER JOIN category ON category.id_category = transactions_categories.id_category WHERE id_transaction = :id_transaction");
            $stmtCategory->bindParam(':id_transaction', $id, \PDO::PARAM_INT);
            $stmtCategory->execute();
            $categories = $stmtCategory->fetchAll(\PDO::FETCH_ASSOC);

            $result["list_category"] = [
                "category" => "",
                "subcategories" => []
            ];

            foreach($categories as &$category){
                // On vérifie si la $category de la transaction est une sous-catégorie
                if (!$category["parent_id"]){
                    $result["list_category"]["category"] = $category["name_category"];
                }
                else {
                    array_push($result["list_category"]["subcategories"], $category["name_category"]);
                }
            }

            return $result;
        }
        catch(PDOException $e){
            echo json_encode(["message" => "Erreur lors de la récupération de la transaction", "PDO" => $e]);
            exit;
        }
    }
}