-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Apr 02, 2026 at 11:39 PM
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
  `path` text NOT NULL,
  `photographer_id` int NOT NULL,
  `password` int DEFAULT NULL,
  `created_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `detail`, `poster`, `path`, `photographer_id`, `password`, `created_at`) VALUES
(4, 'งานนี้ต้องทดสอบบบ', 'ทดสอบระบบ', '4_poster.jpg', '4', 1, NULL, '0000-00-00 00:00:00'),
(5, 'กรุงเทพ', 'เทพๆกรุงๆ', '5_poster.jpg', '5', 1, NULL, '0000-00-00 00:00:00'),
(6, 'วิ่งไก่ใส่ไข่ดาว', 'วิ่งไก่ใส่ไข่ดาว', '6_poster.jpg', '6', 1, NULL, '0000-00-00 00:00:00'),
(7, 'น้องต๋องหร่องแหรง', 'ต๋องกินไก่\r\n', '7_poster.jpeg', '7', 1, NULL, '0000-00-00 00:00:00'),
(8, 'user_118226938', 'sfdfasfasf', '8_poster.JPG', '8', 1, 136223, '2026-04-02 21:50:15');

-- --------------------------------------------------------

--
-- Table structure for table `event_access`
--

CREATE TABLE `event_access` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `attendee_id` int NOT NULL,
  `created_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `event_access`
--

INSERT INTO `event_access` (`id`, `event_id`, `attendee_id`, `created_at`) VALUES
(1, 8, 2, '2026-04-02 22:01:44'),
(2, 8, 6, '2026-04-02 23:34:44');

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

--
-- Dumping data for table `event_collaborators`
--

INSERT INTO `event_collaborators` (`id`, `event_id`, `photographer_id`, `role`, `joined_at`) VALUES
(1, 7, 6, 'photographer', '2026-04-02 23:23:49');

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
-- Dumping data for table `face`
--

INSERT INTO `face` (`id`, `photos_id`, `face_id`, `attendee_id`, `created_at`) VALUES
(12, 61, 'd771c54a-4736-4a8a-bc2a-85936c2e0d9e', NULL, '0000-00-00 00:00:00'),
(13, 61, '412318e6-421d-4d60-81e1-517ce1b0fff2', NULL, '0000-00-00 00:00:00'),
(14, 61, 'f5291f0c-f2d6-4c58-b831-bedcca0d177b', NULL, '0000-00-00 00:00:00'),
(15, 61, 'dd1f771f-31fa-455d-826d-416f6c2346e9', NULL, '0000-00-00 00:00:00'),
(16, 61, '62f193d4-7e08-4721-9d07-5bce13b9cb5b', NULL, '0000-00-00 00:00:00'),
(17, 61, '4f081b7e-669c-474e-bc10-801fd0311324', NULL, '0000-00-00 00:00:00'),
(18, 61, 'f73d3e6c-039c-4261-87e9-f48117a17feb', NULL, '0000-00-00 00:00:00'),
(19, 62, 'ede39dc5-7f6b-4b43-91d7-72d6acc38c72', NULL, '0000-00-00 00:00:00'),
(20, 62, 'b68da14b-f231-400a-b337-d3fb85bc9a22', NULL, '0000-00-00 00:00:00'),
(21, 62, 'bd28ecab-56b0-4ba0-a614-f692b89a44dd', NULL, '0000-00-00 00:00:00'),
(22, 63, 'f20a187b-d4d0-4ad3-9b71-9e6a17b2b92d', NULL, '0000-00-00 00:00:00'),
(23, 64, '3c2ee4eb-b6e0-47fe-b7da-b6eba6f03d75', NULL, '0000-00-00 00:00:00'),
(24, 65, '0ea0bfc3-51ba-4533-b2b7-9cbf9246f419', 2, '0000-00-00 00:00:00'),
(25, 66, 'cf22cff3-c9b3-4cf9-b6ad-769c2dc0dfc5', 2, '0000-00-00 00:00:00'),
(26, 66, 'f1abf571-dcfb-45e0-bae0-cea8d25824a8', NULL, '0000-00-00 00:00:00'),
(27, 67, '1b6c00ab-45a3-4bae-b451-7859395e45da', NULL, '0000-00-00 00:00:00'),
(28, 67, 'fc4e3086-00cf-4929-8e53-8868703fd5e8', NULL, '0000-00-00 00:00:00'),
(29, 68, '9e3513c3-2ca0-40e4-a21b-9e7724a66645', NULL, '0000-00-00 00:00:00'),
(30, 68, 'b52b9109-fafb-4186-9c93-27f5be620329', NULL, '0000-00-00 00:00:00'),
(31, 68, '03d34dec-e4e5-4ee9-8327-f36ece7b4426', NULL, '0000-00-00 00:00:00'),
(32, 68, '8a06a596-3981-4104-8d06-9ea2b756898e', 2, '0000-00-00 00:00:00'),
(33, 69, '99d9587c-0bfb-4063-8b62-3d60e2c69b60', NULL, '0000-00-00 00:00:00'),
(34, 69, '52bfe197-b7b4-4578-94eb-b50b802307a4', 2, '0000-00-00 00:00:00'),
(35, 70, '69207ef8-7f10-44ea-b126-d4021673944b', NULL, '0000-00-00 00:00:00'),
(36, 70, 'eb7211da-71d9-410c-ab7a-97ab21fae236', 2, '0000-00-00 00:00:00'),
(37, 73, '8ac62f5b-c8c0-4c65-b7f6-449342eca1b2', 2, '0000-00-00 00:00:00'),
(38, 73, '6c6d8403-ec1e-4546-9d98-14adc065edb8', NULL, '0000-00-00 00:00:00'),
(39, 73, '7545f49d-6588-4875-bfaf-2b4609bdf65d', NULL, '0000-00-00 00:00:00'),
(40, 73, '81773dab-ce96-42c1-b153-82ca4b357af0', NULL, '0000-00-00 00:00:00'),
(41, 74, '88e0687c-e086-4b35-b9d9-e30d7259a4d4', NULL, '0000-00-00 00:00:00'),
(42, 76, '3764add2-26db-406b-b112-d7004fd8c1c6', NULL, '0000-00-00 00:00:00'),
(43, 76, '3da72bf4-4da3-4b07-a752-20908391e3e4', NULL, '0000-00-00 00:00:00'),
(44, 76, '5cbee157-949d-4daf-b865-c91ff0ad12f1', NULL, '0000-00-00 00:00:00'),
(45, 76, '7b91a018-c686-49e3-888a-743ba1741b42', NULL, '0000-00-00 00:00:00'),
(46, 77, 'ac20a6f5-6f51-4fce-ae41-dfd7ff0297bd', NULL, '0000-00-00 00:00:00'),
(47, 77, 'd7887818-fd5d-452f-9afd-194d341f0a91', NULL, '0000-00-00 00:00:00'),
(48, 77, '8d996219-9606-42af-9938-e2fcbf643b58', NULL, '0000-00-00 00:00:00'),
(49, 78, '5c577a19-e911-41db-a274-a61feba49856', NULL, '0000-00-00 00:00:00'),
(50, 78, '949cdb41-539b-40e0-9855-ee5c0448aeef', NULL, '0000-00-00 00:00:00'),
(51, 79, 'aa95c086-7a43-480b-bcaa-6e23d0f53914', NULL, '0000-00-00 00:00:00'),
(52, 80, '9878ca89-6e63-4010-a848-a9ce4156dc81', NULL, '0000-00-00 00:00:00'),
(53, 81, 'bebe4266-b791-47a6-aa2e-ec5af20291f8', NULL, '0000-00-00 00:00:00'),
(54, 82, '38421904-9349-4ad2-91fd-cd31347ca377', NULL, '0000-00-00 00:00:00'),
(55, 82, '67c4d815-af06-4fcf-940a-ee7dc13cb5db', NULL, '0000-00-00 00:00:00'),
(56, 82, 'c0fd6e8f-1181-494f-9f47-0fbb59bf2475', NULL, '0000-00-00 00:00:00'),
(57, 74, '88e0687c-e086-4b35-b9d9-e30d7259a4d4', NULL, '0000-00-00 00:00:00'),
(58, 76, '3764add2-26db-406b-b112-d7004fd8c1c6', NULL, '0000-00-00 00:00:00'),
(59, 76, '3da72bf4-4da3-4b07-a752-20908391e3e4', NULL, '0000-00-00 00:00:00'),
(60, 76, '5cbee157-949d-4daf-b865-c91ff0ad12f1', NULL, '0000-00-00 00:00:00'),
(61, 76, '7b91a018-c686-49e3-888a-743ba1741b42', NULL, '0000-00-00 00:00:00'),
(62, 77, 'ac20a6f5-6f51-4fce-ae41-dfd7ff0297bd', NULL, '0000-00-00 00:00:00'),
(63, 77, 'd7887818-fd5d-452f-9afd-194d341f0a91', NULL, '0000-00-00 00:00:00'),
(64, 77, '8d996219-9606-42af-9938-e2fcbf643b58', NULL, '0000-00-00 00:00:00'),
(65, 78, '5c577a19-e911-41db-a274-a61feba49856', NULL, '0000-00-00 00:00:00'),
(66, 78, '949cdb41-539b-40e0-9855-ee5c0448aeef', NULL, '0000-00-00 00:00:00'),
(67, 79, 'aa95c086-7a43-480b-bcaa-6e23d0f53914', NULL, '0000-00-00 00:00:00'),
(68, 80, '9878ca89-6e63-4010-a848-a9ce4156dc81', NULL, '0000-00-00 00:00:00'),
(69, 81, 'bebe4266-b791-47a6-aa2e-ec5af20291f8', NULL, '0000-00-00 00:00:00'),
(70, 82, '38421904-9349-4ad2-91fd-cd31347ca377', NULL, '0000-00-00 00:00:00'),
(71, 82, '67c4d815-af06-4fcf-940a-ee7dc13cb5db', NULL, '0000-00-00 00:00:00'),
(72, 82, 'c0fd6e8f-1181-494f-9f47-0fbb59bf2475', NULL, '0000-00-00 00:00:00'),
(73, 86, '7c33b5d7-d80d-4df9-80b0-96e118038c39', NULL, '0000-00-00 00:00:00'),
(74, 92, '713ad3e6-6bc8-4080-8b8d-85c9a3904508', NULL, '0000-00-00 00:00:00'),
(75, 92, 'b05e1404-61df-40a8-bef9-cc86cbe55433', NULL, '0000-00-00 00:00:00'),
(76, 96, '0084fb2d-ae42-48a4-a5ef-2442e9f65c01', 3, '0000-00-00 00:00:00'),
(77, 97, '5d505eca-b418-4f51-9edb-c4d3f2c4fd94', 3, '0000-00-00 00:00:00'),
(84, 96, '0084fb2d-ae42-48a4-a5ef-2442e9f65c01', 3, '0000-00-00 00:00:00'),
(85, 97, '5d505eca-b418-4f51-9edb-c4d3f2c4fd94', 3, '0000-00-00 00:00:00'),
(92, 100, 'fb02e44c-1727-4d24-ab36-5d9279a70a33', NULL, '0000-00-00 00:00:00'),
(93, 100, 'cc2f6c84-c655-4b7c-9274-8ddd5f0a7375', NULL, '0000-00-00 00:00:00'),
(94, 100, '998d671e-95f7-4ab6-be92-b959394a83fe', NULL, '0000-00-00 00:00:00'),
(95, 100, 'e4e7bb19-b812-4536-87a8-47d7f7dbd4bc', NULL, '0000-00-00 00:00:00'),
(96, 101, '02ab4e33-bce2-4e42-b990-e67521e5529b', NULL, '0000-00-00 00:00:00'),
(97, 101, 'd9ac2dbe-587a-4f6b-a1ed-105ffad10e2e', NULL, '0000-00-00 00:00:00'),
(98, 101, '481bc8a9-1e8d-436c-b229-36baa45e5891', NULL, '0000-00-00 00:00:00'),
(99, 102, 'c552ceeb-94a5-40cf-9530-4c4156902f58', NULL, '0000-00-00 00:00:00'),
(100, 102, 'eb082f9a-59a5-42df-9b3a-cee894cbfdf3', NULL, '0000-00-00 00:00:00'),
(101, 103, '1cfb12af-b419-46cf-9d1a-04bc1677eff9', NULL, '0000-00-00 00:00:00'),
(102, 104, '90664aec-ba9d-442b-a7e8-99efbcffe175', 3, '0000-00-00 00:00:00'),
(103, 105, '8e6a5739-f862-48a6-883a-bbd9a4ef920a', NULL, '0000-00-00 00:00:00'),
(104, 106, '1c7cb0ee-1f8b-411f-9869-3f0b8a528b5a', 3, '0000-00-00 00:00:00'),
(105, 106, '8d29a9c8-b6bf-4cd4-b845-f419ca5bbf76', NULL, '0000-00-00 00:00:00'),
(106, 106, 'dd704dfa-e8af-4e5b-b3b4-5d52ab2547ce', NULL, '0000-00-00 00:00:00'),
(107, 96, '0084fb2d-ae42-48a4-a5ef-2442e9f65c01', 3, '0000-00-00 00:00:00'),
(108, 97, '5d505eca-b418-4f51-9edb-c4d3f2c4fd94', 3, '0000-00-00 00:00:00'),
(115, 100, 'fb02e44c-1727-4d24-ab36-5d9279a70a33', NULL, '0000-00-00 00:00:00'),
(116, 100, 'cc2f6c84-c655-4b7c-9274-8ddd5f0a7375', NULL, '0000-00-00 00:00:00'),
(117, 100, '998d671e-95f7-4ab6-be92-b959394a83fe', NULL, '0000-00-00 00:00:00'),
(118, 100, 'e4e7bb19-b812-4536-87a8-47d7f7dbd4bc', NULL, '0000-00-00 00:00:00'),
(119, 101, '02ab4e33-bce2-4e42-b990-e67521e5529b', NULL, '0000-00-00 00:00:00'),
(120, 101, 'd9ac2dbe-587a-4f6b-a1ed-105ffad10e2e', NULL, '0000-00-00 00:00:00'),
(121, 101, '481bc8a9-1e8d-436c-b229-36baa45e5891', NULL, '0000-00-00 00:00:00'),
(122, 102, 'c552ceeb-94a5-40cf-9530-4c4156902f58', NULL, '0000-00-00 00:00:00'),
(123, 102, 'eb082f9a-59a5-42df-9b3a-cee894cbfdf3', NULL, '0000-00-00 00:00:00'),
(124, 103, '1cfb12af-b419-46cf-9d1a-04bc1677eff9', NULL, '0000-00-00 00:00:00'),
(125, 104, '90664aec-ba9d-442b-a7e8-99efbcffe175', 3, '0000-00-00 00:00:00'),
(126, 105, '8e6a5739-f862-48a6-883a-bbd9a4ef920a', NULL, '0000-00-00 00:00:00'),
(127, 106, '1c7cb0ee-1f8b-411f-9869-3f0b8a528b5a', 3, '0000-00-00 00:00:00'),
(128, 106, '8d29a9c8-b6bf-4cd4-b845-f419ca5bbf76', NULL, '0000-00-00 00:00:00'),
(129, 106, 'dd704dfa-e8af-4e5b-b3b4-5d52ab2547ce', NULL, '0000-00-00 00:00:00'),
(130, 110, 'd45b6e40-72af-43bb-99f8-018d0bedb60e', NULL, '0000-00-00 00:00:00'),
(131, 110, '755be65a-c9d3-4b19-8752-db825c30bf30', 3, '0000-00-00 00:00:00'),
(132, 110, '940c1389-953b-4e97-80d6-107720c57ff1', NULL, '0000-00-00 00:00:00');

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
  `role` text NOT NULL,
  `created_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`id`, `name`, `mail`, `password`, `profile`, `img_1`, `img_2`, `img_3`, `role`, `created_at`) VALUES
(1, 'user_118226938', 'tyrk0night@gmail.com', '$2b$10$5j/emBzAuG1fzYdhy/w7OefkF4Yk/EGzZaEqUBgEkLhT9/R9hRflW', '1_prof.png', NULL, NULL, NULL, 'photographer', '0000-00-00 00:00:00'),
(2, 'T KHUNSIRIKUN', 'ggg@gmail.com', '$2b$10$4.ptTRPJb9esD9HXS.ETvuv0skmnZtyBUuavITkTjr0ifuZy3OapO', '2_prof.png', '2_img_1.png', '2_img_2.png', '2_img_3.png', 'attendee', '0000-00-00 00:00:00'),
(3, 'Nithikron', 'Nithikron@hmail.com', '$2b$10$DEho5d0pFKrACsPQtGLoNu0QUQ936bR6MegNIvX16ZDcaQlV0sPNy', '3_prof.jpeg', '3_img_1.jpeg', '3_img_2.jpeg', '3_img_3.png', 'attendee', '0000-00-00 00:00:00'),
(4, '6640205834', 'test1@g.com', '$2b$10$p21zCtrl2.rfFP8DQQpOMejMsg6kUSVCDkxmHRVfTVrQ9A5QJ6BdS', 'default-profile.png', '4_img_1.jpeg', '4_img_2.jpeg', '4_img_3.jpeg', 'attendee', '0000-00-00 00:00:00'),
(5, 'tina lee', 'tinalee@gmail.com', '$2b$10$BpVCluHrbWxjVWcbOy1L8O075onsBWrh6n08vMdvNmiUjqhjkAHA6', 'default-profile.png', NULL, NULL, NULL, 'photographer', '0000-00-00 00:00:00'),
(6, 'user_118226938', '112@gmail.com', '$2b$10$UIF3rwoQP6FwaMmPI2GW9.WpqikjPraMkmvmCRz65mZtYgJqHPmHG', 'default-profile.png', NULL, NULL, NULL, 'photographer', '2026-04-02 23:23:05');

-- --------------------------------------------------------

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
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `image_path`, `event_id`, `photographer_id`, `created_at`) VALUES
(61, 'photo_1774842416456_r6qsq9m.jpg', 4, 1, '0000-00-00 00:00:00'),
(62, 'photo_1774843197781_gw0423r.jpg', 5, 1, '0000-00-00 00:00:00'),
(63, 'photo_1774843197785_w1wjyr9.jpg', 5, 1, '0000-00-00 00:00:00'),
(64, 'photo_1774843197791_dz0hv3h.jpg', 5, 1, '0000-00-00 00:00:00'),
(65, 'photo_1774843197794_71y3jhk.jpg', 5, 1, '0000-00-00 00:00:00'),
(66, 'photo_1774843197797_uwsg3sm.jpg', 5, 1, '0000-00-00 00:00:00'),
(67, 'photo_1774843197801_u6ws0ml.jpg', 5, 1, '0000-00-00 00:00:00'),
(68, 'photo_1774843197814_kg27n6g.jpg', 5, 1, '0000-00-00 00:00:00'),
(69, 'photo_1774843197817_htzs9k1.jpg', 5, 1, '0000-00-00 00:00:00'),
(70, 'photo_1774843197819_zkti0w4.jpg', 5, 1, '0000-00-00 00:00:00'),
(71, 'photo_1774843197821_s77p84p.jpg', 5, 1, '0000-00-00 00:00:00'),
(72, 'photo_1774843197823_npyzzxo.jpg', 5, 1, '0000-00-00 00:00:00'),
(73, 'photo_1774843197828_hsr4146.jpg', 5, 1, '0000-00-00 00:00:00'),
(74, 'photo_1774860677649_abir3fd.jpg', 6, 1, '0000-00-00 00:00:00'),
(75, 'photo_1774860677654_ejlwx4d.jpg', 6, 1, '0000-00-00 00:00:00'),
(76, 'photo_1774860677664_zen9cq1.jpg', 6, 1, '0000-00-00 00:00:00'),
(77, 'photo_1774860677679_atpvmj5.jpg', 6, 1, '0000-00-00 00:00:00'),
(78, 'photo_1774860677686_8ytrsiy.jpg', 6, 1, '0000-00-00 00:00:00'),
(79, 'photo_1774860677692_zcfk21k.jpg', 6, 1, '0000-00-00 00:00:00'),
(80, 'photo_1774860677696_1prwust.jpg', 6, 1, '0000-00-00 00:00:00'),
(81, 'photo_1774860677706_ysdgmp8.jpg', 6, 1, '0000-00-00 00:00:00'),
(82, 'photo_1774860677714_w5b4anp.jpg', 6, 1, '0000-00-00 00:00:00'),
(83, 'photo_1774860677720_x6pw5cv.jpg', 6, 1, '0000-00-00 00:00:00'),
(84, 'photo_1774860677727_sgxvc7h.jpg', 6, 1, '0000-00-00 00:00:00'),
(85, 'photo_1774860677735_m5cdui3.jpg', 6, 1, '0000-00-00 00:00:00'),
(86, 'photo_1774860714807_2jiqtzk.jpg', 6, 1, '0000-00-00 00:00:00'),
(87, 'photo_1774860714815_8wd0f3r.jpg', 6, 1, '0000-00-00 00:00:00'),
(88, 'photo_1774860714820_l74q1cd.jpg', 6, 1, '0000-00-00 00:00:00'),
(89, 'photo_1774860714827_ahk92kq.jpg', 6, 1, '0000-00-00 00:00:00'),
(90, 'photo_1774860714831_a3tcx61.jpg', 6, 1, '0000-00-00 00:00:00'),
(91, 'photo_1774860714838_vctostf.jpg', 6, 1, '0000-00-00 00:00:00'),
(92, 'photo_1774860714841_lgzywz8.jpg', 6, 1, '0000-00-00 00:00:00'),
(93, 'photo_1774860714844_89d4ypv.jpg', 6, 1, '0000-00-00 00:00:00'),
(94, 'photo_1774860714847_u4wzjkr.jpg', 6, 1, '0000-00-00 00:00:00'),
(95, 'photo_1774860714849_ywu15zq.jpg', 6, 1, '0000-00-00 00:00:00'),
(96, 'photo_1774867900059_xs4i0nf.jpeg', 7, 1, '0000-00-00 00:00:00'),
(97, 'photo_1774867900063_gviipiu.jpeg', 7, 1, '0000-00-00 00:00:00'),
(100, 'photo_1774867922104_tsat3hu.jpg', 7, 1, '0000-00-00 00:00:00'),
(101, 'photo_1774867922109_z26b0xa.jpg', 7, 1, '0000-00-00 00:00:00'),
(102, 'photo_1774867922115_vmg1uuh.jpg', 7, 1, '0000-00-00 00:00:00'),
(103, 'photo_1774867922118_lr9zfvo.jpg', 7, 1, '0000-00-00 00:00:00'),
(104, 'photo_1774867922120_jvti4kg.jpg', 7, 1, '0000-00-00 00:00:00'),
(105, 'photo_1774867922121_pb9syl1.jpg', 7, 1, '0000-00-00 00:00:00'),
(106, 'photo_1774867922123_viue04r.jpg', 7, 1, '0000-00-00 00:00:00'),
(107, 'photo_1774867922124_6qmc53y.jpg', 7, 1, '0000-00-00 00:00:00'),
(109, 'photo_1774867922127_uoh5tu8.jpg', 7, 1, '0000-00-00 00:00:00'),
(110, 'photo_1774867964372_mqxp531.jpeg', 7, 1, '0000-00-00 00:00:00'),
(111, 'photo_1775172378395_vsm26oz.JPG', 7, 6, '2026-04-02 23:26:18');

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `event_access`
--
ALTER TABLE `event_access`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `event_collaborators`
--
ALTER TABLE `event_collaborators`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `face`
--
ALTER TABLE `face`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

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
