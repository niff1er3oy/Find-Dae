-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Mar 30, 2026 at 02:39 AM
-- Server version: 8.0.43
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `find_dae`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `name` text NOT NULL,
  `detail` text NOT NULL,
  `poster` text NOT NULL,
  `path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `detail`, `poster`, `path`) VALUES
(1, '26511', '4564546', '1_poster.png', '1'),
(2, 'T KHUNSIRIKUN', 'ฟหกไๆๆแผ', '2_poster.png', '2'),
(3, 'capture', 'ฟ', '3_poster.jpg', '3');

-- --------------------------------------------------------

--
-- Table structure for table `face`
--

CREATE TABLE `face` (
  `id` int NOT NULL,
  `photos_id` int NOT NULL,
  `face_id` text NOT NULL,
  `member_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `face`
--

INSERT INTO `face` (`id`, `photos_id`, `face_id`, `member_id`) VALUES
(8, 56, '5e4b89f8-d5cb-4700-b36f-deca2fed15e5', NULL),
(9, 56, 'b9926f73-9dce-46d1-ba65-f612819db5af', 2),
(10, 56, 'a2fb1855-8f2c-4043-9193-939ba8df7982', NULL),
(11, 56, 'c31c641e-141b-47c6-a099-5134d02ed09d', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `id` int NOT NULL,
  `name` text NOT NULL,
  `mail` text NOT NULL,
  `password` text NOT NULL,
  `profile` text NOT NULL,
  `img_1` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `img_2` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `img_3` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `role` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`id`, `name`, `mail`, `password`, `profile`, `img_1`, `img_2`, `img_3`, `role`) VALUES
(1, 'user_118226938', 'tyrk0night@gmail.com', '$2b$10$5j/emBzAuG1fzYdhy/w7OefkF4Yk/EGzZaEqUBgEkLhT9/R9hRflW', '1_prof.png', NULL, NULL, NULL, 'photographer'),
(2, 'T KHUNSIRIKUN', 'ggg@gmail.com', '$2b$10$4.ptTRPJb9esD9HXS.ETvuv0skmnZtyBUuavITkTjr0ifuZy3OapO', '2_prof.png', '2_img_1.png', '2_img_2.png', '2_img_3.png', 'attendee');

-- --------------------------------------------------------

--
-- Table structure for table `me_have`
--

CREATE TABLE `me_have` (
  `id` int NOT NULL,
  `photos_id` int NOT NULL,
  `member_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int NOT NULL,
  `image_path` text NOT NULL,
  `event_id` int NOT NULL,
  `cameraman_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `image_path`, `event_id`, `cameraman_id`) VALUES
(56, 'photo_1774837872013_7m843n2.png', 2, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `face`
--
ALTER TABLE `face`
  ADD PRIMARY KEY (`id`),
  ADD KEY `photos_id` (`photos_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `me_have`
--
ALTER TABLE `me_have`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `photos_id` (`photos_id`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `cameraman_id` (`cameraman_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `face`
--
ALTER TABLE `face`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `me_have`
--
ALTER TABLE `me_have`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `face`
--
ALTER TABLE `face`
  ADD CONSTRAINT `face_ibfk_1` FOREIGN KEY (`photos_id`) REFERENCES `photos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `face_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `me_have`
--
ALTER TABLE `me_have`
  ADD CONSTRAINT `member_id` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `photos_id` FOREIGN KEY (`photos_id`) REFERENCES `photos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `cameraman_id` FOREIGN KEY (`cameraman_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `event_id` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
