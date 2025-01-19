-- phpMyAdmin SQL Dump
-- version 5.2.1deb1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : sam. 18 jan. 2025 à 12:51
-- Version du serveur : 10.11.6-MariaDB-0+deb12u1
-- Version de PHP : 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `finance_flow`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id_category` int(11) NOT NULL,
  `name_category` varchar(100) NOT NULL,
  `parent_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id_category`, `name_category`, `parent_id`) VALUES
(1, 'Alimentation', NULL),
(2, 'Logement', NULL),
(3, 'Transport', NULL),
(4, 'Divertissement', NULL),
(5, 'Santé', NULL),
(6, 'Revenus', NULL),
(7, 'Fruits et légumes', 1),
(8, 'Produits laitiers', 1),
(9, 'Viande et poisson', 1),
(10, 'Autres courses alimentaires', 1),
(11, 'Loyer', 2),
(12, 'Factures d’électricité', 2),
(13, 'Eau et gaz', 2),
(14, 'Entretien', 2),
(15, 'Essence', 3),
(16, 'Transport en commun', 3),
(17, 'Assurance auto', 3),
(18, 'Entretien véhicule', 3),
(19, 'Cinéma', 4),
(20, 'Sorties', 4),
(21, 'Abonnements', 4),
(22, 'Loisirs', 4),
(23, 'Médecin', 5),
(24, 'Pharmacie', 5),
(25, 'Assurance santé', 5),
(26, 'Autres dépenses santé', 5),
(27, 'Salaire', 6),
(28, 'Bonus', 6),
(29, 'Autres revenus', 6);

-- --------------------------------------------------------

--
-- Structure de la table `transaction`
--

CREATE TABLE `transaction` (
  `id_transaction` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `type_transaction` enum('revenu','dépense') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `place` varchar(100) DEFAULT NULL,
  `currency_code` varchar(3) DEFAULT NULL,
  `currency_symbol` varchar(5) DEFAULT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `transaction`
--

-- --------------------------------------------------------

--
-- Structure de la table `transactions_categories`
--

CREATE TABLE `transactions_categories` (
  `id_transaction` int(11) NOT NULL,
  `id_category` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `transactions_categories`
--


-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `role` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--


-- Index pour les tables déchargées
--

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id_category`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Index pour la table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id_transaction`),
  ADD KEY `id_user` (`id_user`);

--
-- Index pour la table `transactions_categories`
--
ALTER TABLE `transactions_categories`
  ADD KEY `id_transaction` (`id_transaction`),
  ADD KEY `id_category` (`id_category`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id_transaction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `category` (`id_category`);

--
-- Contraintes pour la table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);

--
-- Contraintes pour la table `transactions_categories`
--
ALTER TABLE `transactions_categories`
  ADD CONSTRAINT `transactions_categories_ibfk_1` FOREIGN KEY (`id_transaction`) REFERENCES `transaction` (`id_transaction`),
  ADD CONSTRAINT `transactions_categories_ibfk_2` FOREIGN KEY (`id_category`) REFERENCES `category` (`id_category`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
