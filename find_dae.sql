-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Aug 05, 2026 at 05:58 AM
-- Server version: 8.0.46
-- PHP Version: 8.3.26

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
  `path` text NOT NULL,
  `photographer_id` int NOT NULL,
  `password` int DEFAULT NULL,
  `created_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Table structure for table `event_access`
--

CREATE TABLE `event_access` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `attendee_id` int NOT NULL,
  `created_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


-- --------------------------------------------------------

--
-- Table structure for table `event_collaborators`
--

CREATE TABLE `event_collaborators` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `photographer_id` int NOT NULL,
  `role` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `joined_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `face`
--

CREATE TABLE `face` (
  `id` int NOT NULL,
  `photos_id` int NOT NULL,
  `face_id` text NOT NULL,
  `attendee_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

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
  `role` text NOT NULL,
  `created_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int NOT NULL,
  `image_path` text NOT NULL,
  `event_id` int NOT NULL,
  `photographer_id` int NOT NULL,
  `created_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`photographer_id`);

--
-- Indexes for table `event_access`
--
ALTER TABLE `event_access`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendee_id` (`attendee_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `event_collaborators`
--
ALTER TABLE `event_collaborators`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `photographer_id` (`photographer_id`);

--
-- Indexes for table `face`
--
ALTER TABLE `face`
  ADD PRIMARY KEY (`id`),
  ADD KEY `photos_id` (`photos_id`),
  ADD KEY `member_id` (`attendee_id`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `cameraman_id` (`photographer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `event_access`
--
ALTER TABLE `event_access`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `event_collaborators`
--
ALTER TABLE `event_collaborators`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `face`
--
ALTER TABLE `face`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`photographer_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `event_access`
--
ALTER TABLE `event_access`
  ADD CONSTRAINT `event_access_ibfk_1` FOREIGN KEY (`attendee_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `event_access_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `event_collaborators`
--
ALTER TABLE `event_collaborators`
  ADD CONSTRAINT `event_collaborators_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `event_collaborators_ibfk_2` FOREIGN KEY (`photographer_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `face`
--
ALTER TABLE `face`
  ADD CONSTRAINT `face_ibfk_1` FOREIGN KEY (`photos_id`) REFERENCES `photos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `face_ibfk_2` FOREIGN KEY (`attendee_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `cameraman_id` FOREIGN KEY (`photographer_id`) REFERENCES `member` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `event_id` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
