-- phpMyAdmin SQL Dump
-- version 4.4.2
-- http://www.phpmyadmin.net
--
-- Host: h90hr-mysql1
-- Generation Time: Jun 09, 2015 at 07:10 AM
-- Server version: 5.5.27-log
-- PHP Version: 5.4.39

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mysql62930`
--
CREATE DATABASE IF NOT EXISTS `mysql62930` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `mysql62930`;

-- --------------------------------------------------------

--
-- Table structure for table `stickmantap_config`
--

DROP TABLE IF EXISTS `stickmantap_config`;
CREATE TABLE IF NOT EXISTS `stickmantap_config` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `stickmantap_users`
--

DROP TABLE IF EXISTS `stickmantap_users`;
CREATE TABLE IF NOT EXISTS `stickmantap_users` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `character_name` text NOT NULL,
  `character_level` int(11) NOT NULL,
  `character_coins` int(11) NOT NULL,
  `max_game_level` int(11) NOT NULL,
  `last_action` bigint(20) NOT NULL,
  `api_url` text NOT NULL,
  `character_game_level` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `stickmantap_config`
--
ALTER TABLE `stickmantap_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stickmantap_users`
--
ALTER TABLE `stickmantap_users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `stickmantap_config`
--
ALTER TABLE `stickmantap_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `stickmantap_users`
--
ALTER TABLE `stickmantap_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
