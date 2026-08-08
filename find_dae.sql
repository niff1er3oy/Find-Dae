-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Aug 08, 2026 at 06:02 AM
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
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `detail`, `poster`, `path`, `photographer_id`, `password`, `created_at`) VALUES
(10, 'งานปลูกต้นไม้ku86', 'Green KU ', '10_poster.jpg', '10', 9, 601302, '2026-07-29 10:30:15'),
(15, 'ทดสอบ', 'ทดสอบ', '15_poster.jpg', '15', 11, 2213, '2026-08-06 03:07:52'),
(16, 'camera', '123', '16_poster.jpg', '16', 11, 1234, '2026-08-06 17:28:15'),
(17, 'KU FRESHY DAY&NIGHT (กิจกรรมวิ่งประเพณี)', 'KU FRESHY DAY&NIGHT (กิจกรรมวิ่งประเพณี) ณลานพระพิรุนทรงนาค', '17_poster.jpg', '17', 13, NULL, '2026-08-08 05:30:04');

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
(3, 10, 8, '2026-07-29 11:50:07'),
(4, 15, 12, '2026-08-06 03:37:27'),
(5, 16, 12, '2026-08-06 17:29:47');

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
-- Dumping data for table `face`
--

INSERT INTO `face` (`id`, `photos_id`, `face_id`, `attendee_id`, `created_at`) VALUES
(301, 226, '923d2ad5-c63c-4bf7-b2fe-d15ba9c8b4d8', NULL, '2026-08-06 03:36:02'),
(302, 226, 'ad553cb7-5101-4796-b47c-8411d06cb790', 12, '2026-08-06 03:36:02'),
(303, 227, '888eb498-697f-48be-99ca-e6634cf84dd4', NULL, '2026-08-06 03:36:06'),
(304, 227, 'e711a5d1-a578-4c18-8d12-68be4d471a5e', 12, '2026-08-06 03:36:06'),
(305, 228, 'cdf7c0c0-ad53-4319-ad96-af27013a9e7c', 12, '2026-08-06 03:36:08'),
(306, 228, '56cccd4d-bc8d-4c42-a442-ee31e42445e8', NULL, '2026-08-06 03:36:08'),
(307, 228, '2a478868-876a-41b7-bf85-e890abd0e09c', NULL, '2026-08-06 03:36:08'),
(308, 228, 'a96ccc46-ebca-4c6f-86ea-7b60763248cd', NULL, '2026-08-06 03:36:08'),
(309, 228, 'bfbf1f70-14fb-49e8-a3d7-6f701e9c435b', NULL, '2026-08-06 03:36:08'),
(310, 228, '5a71243b-74f9-4905-8ab7-18b933fcd24d', NULL, '2026-08-06 03:36:08'),
(311, 229, '51d2fa43-475e-4d7d-92a3-f1f32dc2bb78', NULL, '2026-08-06 03:36:11'),
(312, 229, '00adcd12-94b3-418b-a953-cc80865dd6ce', NULL, '2026-08-06 03:36:11'),
(313, 229, '23d2e547-9a86-4d8e-8279-9f2ef3358c85', NULL, '2026-08-06 03:36:11'),
(314, 229, '9da4df3b-be95-4e4e-849c-1e55cc564d4b', NULL, '2026-08-06 03:36:11'),
(315, 229, 'd384f87a-610a-40b7-9f60-11d84a88fbf6', NULL, '2026-08-06 03:36:11'),
(316, 229, 'c9c7243a-18d1-45f4-af4a-784d652b6396', 12, '2026-08-06 03:36:11'),
(317, 229, '7b4e7a97-f1a1-4c92-9ae6-ea45ebb9357f', NULL, '2026-08-06 03:36:11'),
(318, 230, '65301f34-381b-4f02-a639-49a2da247c53', NULL, '2026-08-06 03:36:13'),
(319, 230, '5b7e8001-c661-4183-87dc-81da79f1b8e7', NULL, '2026-08-06 03:36:13'),
(320, 230, '70268191-6866-4a89-a243-b25e2fb25b27', NULL, '2026-08-06 03:36:13'),
(321, 230, 'dd241778-b521-4f07-b5a7-6a9dff69fc1c', NULL, '2026-08-06 03:36:13'),
(322, 230, '664b512b-5bc8-4de2-a64a-7c52a208475e', 12, '2026-08-06 03:36:13'),
(323, 230, 'ec92a0bd-9e2d-422c-94b7-7f3f11215fda', NULL, '2026-08-06 03:36:13'),
(324, 231, '257ae8ba-13cb-4587-88ec-59c9c1538127', NULL, '2026-08-06 03:36:16'),
(325, 231, '0ae487cf-6655-473c-867e-57ce16cef166', NULL, '2026-08-06 03:36:16'),
(326, 231, '439469ac-ff4b-4ecb-b678-b0659f356498', 12, '2026-08-06 03:36:16'),
(327, 231, '3dd0209b-9fa7-4c75-9e28-0d6950c76f81', NULL, '2026-08-06 03:36:16'),
(328, 231, '00b901ca-9840-4d9c-9b49-b487fddf4602', NULL, '2026-08-06 03:36:16'),
(329, 231, 'ebcb4093-e7ac-47e3-a498-fc8d0a49ded4', NULL, '2026-08-06 03:36:16'),
(330, 231, '9b5189a2-3182-4dfd-80ca-a2ce1a1b9524', NULL, '2026-08-06 03:36:16'),
(331, 232, '59545757-7723-49bd-9ab3-fc815856c0d4', 12, '2026-08-06 03:36:18'),
(332, 232, '37430f03-cd6d-4d04-bf23-9868f72e094c', NULL, '2026-08-06 03:36:18'),
(333, 232, 'b1ed77f0-13ae-4868-bf12-fb0516d06ec3', NULL, '2026-08-06 03:36:18'),
(334, 232, 'aa303f5f-a6f7-4bbc-8961-82135ed85cb5', NULL, '2026-08-06 03:36:18'),
(335, 232, 'eece5390-ee98-48b7-a068-cb61ba4ea172', NULL, '2026-08-06 03:36:18'),
(336, 232, 'e16d008b-aa6a-46fc-aac7-967b257b85dc', NULL, '2026-08-06 03:36:18'),
(337, 233, '179ab3f8-7f4e-4daa-a2a5-bdde5168447f', NULL, '2026-08-06 03:36:20'),
(338, 233, 'b8612dda-5313-4f36-a7c3-408954ecc2a6', NULL, '2026-08-06 03:36:20'),
(339, 233, '9ccff726-7edf-4f00-aed5-ff6533641c67', 12, '2026-08-06 03:36:20'),
(340, 233, '57997793-4ec7-4852-a662-e5efecf4b090', NULL, '2026-08-06 03:36:20'),
(341, 233, '91bfe639-7342-42c8-9d00-8568674a68cb', NULL, '2026-08-06 03:36:20'),
(342, 233, '8de07731-7912-47de-b620-cd7e645c78f0', NULL, '2026-08-06 03:36:20'),
(343, 234, '5105460c-2012-41c2-8c83-1c8c8871ac9b', NULL, '2026-08-06 03:36:23'),
(344, 234, '98785bb4-84e7-4dac-b5e1-a078c8a172cc', NULL, '2026-08-06 03:36:23'),
(345, 234, '00db2839-495d-4378-b58d-1af8738b3eb9', NULL, '2026-08-06 03:36:23'),
(346, 234, '7de9ae9a-021d-4c95-9cc0-351292d4560a', NULL, '2026-08-06 03:36:23'),
(347, 234, '255313b8-f090-4d10-8179-73ddee7bd68c', NULL, '2026-08-06 03:36:23'),
(348, 234, 'bac196de-282a-4ce3-bdc2-ee65e42ee41b', NULL, '2026-08-06 03:36:23'),
(349, 234, '1c96f41d-bae5-4da2-a793-a4c973be11cb', 12, '2026-08-06 03:36:23'),
(350, 235, '0590ff67-9ede-420a-a109-d450a94552d4', NULL, '2026-08-06 03:36:25'),
(351, 235, '5c044dd7-5686-4687-a321-a72c75883746', NULL, '2026-08-06 03:36:25'),
(352, 235, 'eb8f679d-46e4-4e63-a143-346b6e4db9a8', NULL, '2026-08-06 03:36:25'),
(353, 235, '993ec3f9-1f19-4fca-a903-ee90accc45df', NULL, '2026-08-06 03:36:25'),
(354, 235, '7104ab26-5790-48af-b677-bade4733fd74', NULL, '2026-08-06 03:36:25'),
(355, 235, 'f6255c9f-b4dd-4688-b712-3a99840a5e93', NULL, '2026-08-06 03:36:25'),
(356, 235, 'ac4401b6-79d0-405c-beb4-2d23221c79f0', 12, '2026-08-06 03:36:25'),
(357, 236, 'b96e4fbb-baf4-4f4d-aa60-6ded335d7c1a', NULL, '2026-08-06 03:36:28'),
(358, 236, '96702f87-af15-4f12-91a5-7334472ef3b4', NULL, '2026-08-06 03:36:28'),
(359, 236, 'a726952e-878c-4c46-95fd-5f94ccadae98', NULL, '2026-08-06 03:36:28'),
(360, 236, 'eec13c9a-be3f-47c3-a627-fa00e1e437d6', NULL, '2026-08-06 03:36:28'),
(361, 236, 'dc7bb5f5-612d-470a-98a9-618b0b92f309', NULL, '2026-08-06 03:36:28'),
(362, 236, '76bb23ed-88b7-4164-aa65-32f942a47d0e', NULL, '2026-08-06 03:36:28'),
(363, 236, 'a48b7b05-cfb2-4d3c-9b8b-9143f76f29db', NULL, '2026-08-06 03:36:28'),
(364, 237, '8cd20284-5678-41e2-8ffe-09db247f88de', NULL, '2026-08-06 03:36:31'),
(365, 237, 'b27dc86a-540e-43c0-915e-5511663f4e8c', NULL, '2026-08-06 03:36:31'),
(366, 237, 'd694df76-ac7b-4e93-8966-094f71e6db77', NULL, '2026-08-06 03:36:31'),
(367, 237, '9c9df4f0-023e-4b91-9d9c-d8966984a2ed', NULL, '2026-08-06 03:36:31'),
(368, 237, 'c27507a2-049e-43cf-9a64-b6c35f54842b', NULL, '2026-08-06 03:36:31'),
(369, 237, 'b893c111-f4bc-4b51-9509-a62297d0ed44', 12, '2026-08-06 03:36:31'),
(370, 237, '677f09b5-1853-48ed-8578-5c2cceef80c7', NULL, '2026-08-06 03:36:31'),
(371, 238, '9925b40b-0a77-401d-828c-3c46aff246d7', NULL, '2026-08-06 03:36:33'),
(372, 238, 'e65c8b71-32ac-49c7-a995-6e4ef3261a08', NULL, '2026-08-06 03:36:33'),
(373, 238, 'dd6736e3-fa22-4a0c-8c28-6a62d80fb2e8', NULL, '2026-08-06 03:36:33'),
(374, 238, '8dcb9fc3-4359-430f-918d-7f7016ebc86d', NULL, '2026-08-06 03:36:33'),
(375, 238, '3e24865a-09bf-4010-bfea-254123693867', 12, '2026-08-06 03:36:33'),
(376, 238, '5542de68-674d-4e13-840f-140f4d938d1b', NULL, '2026-08-06 03:36:33'),
(377, 238, 'a00883f6-6e88-4a67-8b66-551db5e6ad70', NULL, '2026-08-06 03:36:33'),
(378, 239, '483105a8-08ac-4cc6-a99f-c83441312638', NULL, '2026-08-06 03:36:36'),
(379, 239, '1ee441dd-257a-4feb-9728-1840820bff81', NULL, '2026-08-06 03:36:36'),
(380, 239, 'e0a6eeb9-d924-46cc-b8af-5394286ce778', 12, '2026-08-06 03:36:36'),
(381, 239, '0f7e407b-72e0-4e3c-a87f-68242690e0e2', NULL, '2026-08-06 03:36:36'),
(382, 239, '092f3fe0-883a-4ffa-a9f5-0656ff4dd576', NULL, '2026-08-06 03:36:36'),
(383, 240, '39b7ecd4-35ae-4784-9c51-a9baa0c9d3f0', NULL, '2026-08-06 03:36:38'),
(384, 240, '730fb290-3720-4b4f-aa61-29bd905864bc', NULL, '2026-08-06 03:36:38'),
(385, 240, '27d01214-d160-4c10-b2f5-203db67b27cf', NULL, '2026-08-06 03:36:38'),
(386, 240, '7a8d83aa-819e-453d-980b-ffedee1e31bd', NULL, '2026-08-06 03:36:38'),
(387, 240, 'c28a70db-d185-4521-9c92-df4345e1b9a7', NULL, '2026-08-06 03:36:38'),
(388, 240, 'cfd9f27e-2b66-4344-822d-f43e4f68afd7', NULL, '2026-08-06 03:36:38'),
(389, 240, '9f970cce-79b1-4e89-a831-122b0d08ff56', 12, '2026-08-06 03:36:38'),
(390, 241, 'f72f6fe9-4da8-4d64-8067-309d43def8d0', NULL, '2026-08-06 03:36:44'),
(391, 241, '03aa8a16-32c0-4e76-9c9c-3bbe5073e7a1', NULL, '2026-08-06 03:36:44'),
(392, 241, 'ed93734f-d19a-4863-83ba-1b880f364c02', NULL, '2026-08-06 03:36:44'),
(393, 241, '2330b407-161d-4eb8-b1bc-9f88e6f716f4', NULL, '2026-08-06 03:36:44'),
(394, 241, '638d7199-50ef-4a83-959b-4e550724dd87', NULL, '2026-08-06 03:36:44'),
(395, 241, 'c4651e20-a9d1-465a-8692-994943d70ed4', 12, '2026-08-06 03:36:44'),
(396, 241, 'c47687c9-5eca-49a3-860a-8a78b1969257', NULL, '2026-08-06 03:36:44'),
(397, 242, '7678f4e8-f882-49e4-9399-906bc844dbe8', NULL, '2026-08-06 03:36:48'),
(398, 242, 'e9f07c18-b220-46dc-b8d5-013772a9b16c', NULL, '2026-08-06 03:36:48'),
(399, 242, 'f794343f-fe11-4396-ad79-b8c9ac81af0b', NULL, '2026-08-06 03:36:48'),
(400, 242, '493dc1ba-d528-4ef0-b2fa-2737362f5504', NULL, '2026-08-06 03:36:48'),
(401, 242, '65079487-6d45-435f-99d9-52bc8da8840e', NULL, '2026-08-06 03:36:48'),
(402, 242, '890a3490-1efd-47d7-9994-9bee3598855d', 12, '2026-08-06 03:36:48'),
(403, 242, 'b3074b62-7077-4d7e-b3e2-b36655cd6b19', NULL, '2026-08-06 03:36:48'),
(404, 243, '95ee18e8-d21f-43f2-91c6-270b8ea60370', NULL, '2026-08-06 17:28:48'),
(405, 243, '597a8904-25bf-4acf-b149-c17227eeefaa', NULL, '2026-08-06 17:28:48'),
(406, 243, 'fe6a2850-ef9f-4eb2-a314-c1b01cc7ccfd', NULL, '2026-08-06 17:28:48'),
(407, 244, '18ce93a1-e670-4192-a52c-f34b6816e74c', NULL, '2026-08-06 17:28:56'),
(408, 244, 'ba13f03d-7341-46b1-970b-0397a2db22ba', NULL, '2026-08-06 17:28:56'),
(409, 244, '148f9e4b-3a8c-42e2-8145-f73c1ae0fc0e', NULL, '2026-08-06 17:28:56'),
(410, 244, '2262dc04-00a3-4860-9ded-91b203afbe0e', NULL, '2026-08-06 17:28:56'),
(411, 244, 'f4e274b5-22aa-47f1-a8e7-b35e93aef8a0', NULL, '2026-08-06 17:28:56'),
(412, 244, 'a2bbf398-8707-46cb-9ba8-e0b841aba3a5', NULL, '2026-08-06 17:28:56'),
(413, 244, 'b8fb4739-7d1b-44a9-8d6c-02239dfd4977', NULL, '2026-08-06 17:28:56'),
(414, 244, '5dd01609-dc46-4319-8f3f-2afaaa6ca533', NULL, '2026-08-06 17:28:56'),
(415, 244, 'f844fe61-a097-45f7-b853-e4d77aa1036e', 12, '2026-08-06 17:28:56'),
(416, 244, 'ca0b69c5-8ceb-41be-a068-7dcd6e5331a1', NULL, '2026-08-06 17:28:56'),
(417, 245, '055f94a0-78fd-4e62-8354-ba48d6b57a83', NULL, '2026-08-06 17:28:59'),
(418, 245, '6f34dd13-7eb3-4d48-bb28-62a0e97b4164', NULL, '2026-08-06 17:28:59'),
(419, 245, '2b4564e2-2f02-4ae9-ae44-a44b377f0c49', NULL, '2026-08-06 17:28:59'),
(420, 245, 'b7658333-241e-425d-a0dd-d95eaba87d57', NULL, '2026-08-06 17:28:59'),
(421, 245, '07fbc433-dd87-4855-a62c-6be37fdfdead', NULL, '2026-08-06 17:28:59'),
(422, 245, 'db33cf45-bb99-452d-82f8-0603c1eb36c3', NULL, '2026-08-06 17:28:59'),
(423, 245, '6d16b2ce-a455-412d-b02d-ab76e0270e5c', 12, '2026-08-06 17:28:59'),
(424, 245, 'b00d53ed-3425-4379-b154-0ce72e76d419', NULL, '2026-08-06 17:28:59'),
(425, 245, '8c7aa951-59f4-4e83-a309-5a2230d6f64f', NULL, '2026-08-06 17:28:59'),
(426, 245, 'f76d612c-2227-4675-bdae-13fd9afd5a0b', NULL, '2026-08-06 17:28:59'),
(427, 246, '5555643b-75b4-4b69-8188-a80ad8e22b0e', 12, '2026-08-06 17:29:00'),
(428, 246, '257cb453-a8f3-4f80-8a4b-c8037d9cab8f', NULL, '2026-08-06 17:29:01'),
(429, 246, '66111238-8b42-4879-b20b-116df2dc02fa', NULL, '2026-08-06 17:29:01'),
(430, 246, '62f288aa-0121-4c19-8f6f-f9d57579100f', NULL, '2026-08-06 17:29:01'),
(431, 247, '364dabfe-a519-47ed-9687-d9c9356d8849', 12, '2026-08-06 17:29:02'),
(432, 247, '2befa280-278d-48ad-8a8c-9ca518bb1155', NULL, '2026-08-06 17:29:02'),
(433, 247, 'de558b33-0d5e-4256-9ed2-8b31158fe29c', NULL, '2026-08-06 17:29:02'),
(434, 247, 'b9e59101-7e5e-4ed9-a7d5-c3bf2fe2d7cb', NULL, '2026-08-06 17:29:02'),
(435, 248, '993332c9-4c82-41f4-8fde-0547bf1cc7b5', NULL, '2026-08-06 17:29:04'),
(436, 248, '78967923-cbfd-4210-9f6e-e3f66bed3d1b', 12, '2026-08-06 17:29:04'),
(437, 248, 'eccfdb30-0386-4c97-8c6e-21edeb4e7ede', NULL, '2026-08-06 17:29:04'),
(438, 249, 'd1efd5bd-5ecc-44d7-aa45-9aedd336ea7d', NULL, '2026-08-06 17:29:06'),
(439, 249, '8df0e048-1b96-495f-888a-e0c9f802c480', 12, '2026-08-06 17:29:06'),
(440, 249, 'f645f162-476d-4bb5-8e4b-e535dea097d3', NULL, '2026-08-06 17:29:06'),
(441, 250, 'f3d45d12-077a-4fb6-a5e1-f5bf7558a22c', NULL, '2026-08-06 17:29:07'),
(442, 250, '8a99706c-3fd0-4409-b1fb-fa7200053fd0', 12, '2026-08-06 17:29:07'),
(443, 250, 'f70e8c19-b635-4d70-afcc-0d46e3fd4751', NULL, '2026-08-06 17:29:07'),
(444, 251, '55599188-1d4e-4868-b8fe-beae3edd33ee', NULL, '2026-08-06 17:29:08'),
(445, 251, '8caf1d5d-163d-4886-971f-48cb64d5ac82', 12, '2026-08-06 17:29:08'),
(446, 251, 'abb45393-afd6-45a8-9049-0f272e8ee278', NULL, '2026-08-06 17:29:08'),
(447, 252, '48df44ac-5fd5-45e4-bd4f-12b54399461d', NULL, '2026-08-06 17:29:09'),
(448, 252, 'a6a10e1d-fece-467a-854e-51847c8cc170', 12, '2026-08-06 17:29:09'),
(449, 252, 'c6e7726f-5c1b-431d-b00d-b3d379fb5f7d', NULL, '2026-08-06 17:29:09'),
(450, 253, 'de50f168-ac54-4e48-bde3-a81fcfb0b2eb', NULL, '2026-08-06 17:29:11'),
(451, 253, '7128356e-1395-46db-b34f-56f5454295e4', NULL, '2026-08-06 17:29:11'),
(452, 253, '6d1a0779-9e06-4376-b0a9-435dd162eb9c', NULL, '2026-08-06 17:29:12'),
(453, 254, 'f12b882a-3bd4-4f59-802c-7ce48406c3b0', NULL, '2026-08-06 17:29:14'),
(454, 254, 'e4d42ee0-9dbe-48ab-b34b-d59b2a97a402', NULL, '2026-08-06 17:29:14'),
(455, 254, 'f215064a-7326-47d3-9209-0ee0af3dde1b', NULL, '2026-08-06 17:29:14'),
(456, 254, '442e31f5-4ed6-40cd-b80b-a1b2c7e2c1d2', NULL, '2026-08-06 17:29:14'),
(457, 255, 'f3e825df-cf68-40d3-8e06-180811581db5', NULL, '2026-08-06 17:29:16'),
(458, 255, 'cc7de46d-fabd-4f60-bb8b-fe5548b81f5a', 12, '2026-08-06 17:29:16'),
(459, 255, '75d1891d-a80f-4af2-b3ef-763ada2f4b98', NULL, '2026-08-06 17:29:16'),
(460, 255, '9e5f29b8-6545-4de8-b3ec-7c8fa1529134', NULL, '2026-08-06 17:29:16'),
(461, 255, 'b9fb5422-3af9-4775-add3-0af3fa163500', NULL, '2026-08-06 17:29:16'),
(462, 255, 'c468ec34-bcc0-4447-a18e-a6b2893b5e41', NULL, '2026-08-06 17:29:16'),
(463, 255, '66499c31-4a22-4b81-b4cd-22f77fb75e73', NULL, '2026-08-06 17:29:16'),
(464, 255, '7abe795d-0ef8-4c3b-ac5f-e6bcd8be02dd', NULL, '2026-08-06 17:29:16'),
(465, 255, '78638d67-cc63-442c-8e38-683dcb283809', NULL, '2026-08-06 17:29:16'),
(466, 255, '51ecde38-72ce-4d4d-abbd-0d00b593e941', NULL, '2026-08-06 17:29:16'),
(467, 256, 'f97ff789-a39c-498d-9e24-733ac029b8db', NULL, '2026-08-06 17:29:19'),
(468, 256, 'e84728d4-01b5-4f41-b015-a5866ed081d0', 12, '2026-08-06 17:29:19'),
(469, 256, 'd4b6619a-ecaa-4774-b978-0bc870fb029a', NULL, '2026-08-06 17:29:19'),
(470, 256, '4282a5a8-2209-4c51-82c6-22fbfcaf9d62', NULL, '2026-08-06 17:29:19'),
(471, 256, '4a372be2-92be-43da-b66b-cbf1e7d0c636', NULL, '2026-08-06 17:29:19'),
(472, 256, '1c161b1d-79a4-4b63-a865-1eced4cd7675', NULL, '2026-08-06 17:29:19'),
(473, 256, '663aaecf-29f7-4b8c-bb67-01988c879524', NULL, '2026-08-06 17:29:19'),
(474, 256, 'cc84f8ba-c9b9-4963-b818-151b5b601034', NULL, '2026-08-06 17:29:19'),
(475, 256, 'b600c941-950c-4a1f-94d8-a774415e67fd', NULL, '2026-08-06 17:29:19'),
(476, 256, '00ba90f4-51ed-4eba-97b7-9899e9515e5f', NULL, '2026-08-06 17:29:19'),
(477, 257, '8b2c5b04-c819-4158-ae6a-83c231ccedb2', NULL, '2026-08-06 17:29:21'),
(478, 257, '7eb63a2f-dc72-4144-ac58-beb3324dfaa2', 12, '2026-08-06 17:29:21'),
(479, 257, '48f2cb70-b7b3-44be-9966-dc225902d8f8', NULL, '2026-08-06 17:29:21'),
(480, 257, '61d53aa7-c3d1-46fe-9c7a-cc0b5a296018', NULL, '2026-08-06 17:29:21'),
(481, 257, '87f6a291-90bb-4057-8466-cd5f0ae7ee8e', NULL, '2026-08-06 17:29:21'),
(482, 257, 'b1822455-cc9e-45dd-9283-7d83ef2f0522', NULL, '2026-08-06 17:29:21'),
(483, 257, 'f649431e-60ae-4896-af26-7c72254a0351', NULL, '2026-08-06 17:29:21'),
(484, 257, '6b2144b5-d576-48a0-8c53-077fa4f8cc25', NULL, '2026-08-06 17:29:21'),
(485, 257, '61c390de-0551-4468-bf27-84430960e940', NULL, '2026-08-06 17:29:21'),
(486, 257, '3ba1c019-00ef-41a9-a97e-22dccdb2c7b5', NULL, '2026-08-06 17:29:21'),
(487, 258, '84e5df2a-30ba-4f20-9d13-fd535f01affc', NULL, '2026-08-07 08:37:36'),
(488, 258, '1b42eb1e-ded0-4cca-8984-c0e2ee76d30a', NULL, '2026-08-07 08:37:36'),
(489, 258, 'ab3d4243-66ba-4a32-9095-0a1d8ca7ca74', NULL, '2026-08-07 08:37:36'),
(490, 259, '2a1c45ec-5991-4f3c-9263-994a02260090', 12, '2026-08-07 08:38:07'),
(491, 259, '9a61d857-4b35-412d-84f3-08243f48e770', NULL, '2026-08-07 08:38:07'),
(492, 259, '861169d0-92f4-47eb-8a14-35744ab8abb4', NULL, '2026-08-07 08:38:07'),
(493, 259, '407d0bff-5a79-4dd3-9623-289d170db9d3', NULL, '2026-08-07 08:38:07'),
(494, 260, '3c3535fb-95ed-409f-9728-51495efad126', NULL, '2026-08-07 08:38:10'),
(495, 260, 'b065603b-3c68-4e06-8d64-197d19e14153', 12, '2026-08-07 08:38:10'),
(496, 260, '7e32aa9c-cbe3-4a3a-85da-3d34005653c0', NULL, '2026-08-07 08:38:10'),
(497, 261, '722c387e-0250-494e-9f6c-69ab26e3dfb4', NULL, '2026-08-07 08:38:12'),
(498, 261, 'fc8346f7-419f-41b7-9dfd-d984bf67a4a7', 12, '2026-08-07 08:38:12'),
(499, 261, '35de0066-a52f-4fc9-8d6c-a3a36915a42a', NULL, '2026-08-07 08:38:12'),
(500, 262, 'f968dc6a-d773-4323-8dfa-66a1557a2f7a', NULL, '2026-08-07 08:38:14'),
(501, 262, 'e707a5b6-3fca-4da2-adfd-87618db9380e', 12, '2026-08-07 08:38:14'),
(502, 262, '31415bdf-9466-4f25-9e3a-717f0c7735a9', NULL, '2026-08-07 08:38:14'),
(503, 266, 'a916c2f0-fce1-41eb-82cf-38de11e2daf8', NULL, '2026-08-08 05:52:52'),
(504, 266, 'ad58264f-903c-4737-ad3b-cb77b8f7390f', NULL, '2026-08-08 05:52:52'),
(505, 266, '63413868-806d-4199-b887-073f1e82959b', NULL, '2026-08-08 05:52:52'),
(506, 266, 'a1d991a2-ecb3-4292-82ab-cc4ba439e040', NULL, '2026-08-08 05:52:52'),
(507, 266, 'aef13c99-67d8-4d6a-887d-797a7fcc2b06', NULL, '2026-08-08 05:52:52'),
(508, 266, '03fd5a91-d529-4aed-b894-f31499e72249', NULL, '2026-08-08 05:52:52'),
(509, 266, '9aaf1821-7b61-4dd0-8632-0388e4c7b9bf', NULL, '2026-08-08 05:52:52'),
(510, 266, '83711248-a504-4d51-9512-0e9791163f57', NULL, '2026-08-08 05:52:52');

-- --------------------------------------------------------

--
-- Table structure for table `indexing_jobs`
--

CREATE TABLE `indexing_jobs` (
  `job_key` varchar(255) NOT NULL,
  `status` varchar(20) NOT NULL,
  `step` varchar(50) DEFAULT NULL,
  `total` int DEFAULT '0',
  `processed` int DEFAULT '0',
  `current_file` varchar(255) DEFAULT NULL,
  `message` text,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `indexing_jobs`
--

INSERT INTO `indexing_jobs` (`job_key`, `status`, `step`, `total`, `processed`, `current_file`, `message`, `updated_at`) VALUES
('attendee:15:12', 'done', 'completed', 3, 3, NULL, 'เสร็จสิ้น พบรูปของคุณทั้งหมด 20 รูป', '2026-08-07 08:43:14'),
('photographer:15', 'done', 'completed', 4, 4, NULL, 'เสร็จสิ้น จัดทำดัชนีใบหน้าทั้งหมด 13 รายการ', '2026-08-07 08:38:14'),
('photographer:16', 'error', 'creating_collection', 1, 0, NULL, 'weakly-referenced object no longer exists', '2026-08-08 06:00:18');

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
(8, 'test', 'test@gmail.com', '$2b$10$c3EYSaUhwjENtXv9yC//Ke1ReNXYv28dhEm/nZoHuRETi7KPVuG/S', '8_prof.png', NULL, NULL, NULL, 'photographer', '2026-07-29 09:03:29'),
(9, 'Thanyalak ', 'tunyalak.m@ku.th', '$2b$10$eAlT4WoDjpAxj8A/9eNDheVKaNXDUcFUgRGHspl1pL2h7P8mc2S5K', 'default-profile.png', NULL, NULL, NULL, 'photographer', '2026-07-29 10:27:01'),
(10, 'ตากล้อง', 'gggg@gmail.com', '$2b$10$xSCnWejQR2LDcSPS3DEER.y/OwZidvUvUfk6w0v2mu12ngzDjQPJ.', 'default-profile.png', NULL, NULL, NULL, 'photographer', '2026-08-03 04:41:20'),
(11, 'test', 'tyrk0night@gmail.com', '$2b$10$fP8g29bvowV4CWXmwa2uReXe16gfZNT9C.l.GkYdTDtTRpJSWapPu', 'default-profile.png', NULL, NULL, NULL, 'photographer', '2026-08-05 03:10:53'),
(12, 'test', 'tyrk0night1@gmail.com', '$2b$10$aMTmCsASvTVJvV68eDHbCud9V/jXAdgCJzZIgH30ShGZT..pqUf6.', 'default-profile.png', '12_img_1.jpg', '12_img_2.jpg', '12_img_3.jpg', 'attendee', '2026-08-05 03:17:54'),
(13, 'ศิวชาติ นาถาดทอง', 'kipunplug@gmail.com', '$2b$10$2iplXUHyEW359NuiemNukusq8MgKYjoTDyv7iGEaT/0cSswsopOPO', 'default-profile.png', NULL, NULL, NULL, 'photographer', '2026-08-05 03:41:09');

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
(125, 'photo_1785321468650_auzp25y.jpg', 10, 9, '2026-07-29 10:37:48'),
(126, 'photo_1785321468651_xevqxis.jpg', 10, 9, '2026-07-29 10:37:48'),
(127, 'photo_1785321468653_lisslb7.jpg', 10, 9, '2026-07-29 10:37:48'),
(128, 'photo_1785321468656_5icy7on.jpg', 10, 9, '2026-07-29 10:37:48'),
(129, 'photo_1785321468658_4gt56pj.jpg', 10, 9, '2026-07-29 10:37:48'),
(130, 'photo_1785321468661_qcyktpn.jpg', 10, 9, '2026-07-29 10:37:48'),
(131, 'photo_1785321522212_xz5pe42.jpg', 10, 9, '2026-07-29 10:38:42'),
(132, 'photo_1785321522214_2qxr388.jpg', 10, 9, '2026-07-29 10:38:42'),
(133, 'photo_1785321522215_ydfreyk.jpg', 10, 9, '2026-07-29 10:38:42'),
(134, 'photo_1785321522216_vu3j36k.jpg', 10, 9, '2026-07-29 10:38:42'),
(135, 'photo_1785321522217_xukksu2.jpg', 10, 9, '2026-07-29 10:38:42'),
(136, 'photo_1785321522219_4c7t5md.jpg', 10, 9, '2026-07-29 10:38:42'),
(137, 'photo_1785321522222_4g47mwv.jpg', 10, 9, '2026-07-29 10:38:42'),
(138, 'photo_1785321522224_4klpfj1.jpg', 10, 9, '2026-07-29 10:38:42'),
(139, 'photo_1785321522226_3wq74ue.jpg', 10, 9, '2026-07-29 10:38:42'),
(140, 'photo_1785321522228_ucyal1u.jpg', 10, 9, '2026-07-29 10:38:42'),
(141, 'photo_1785321522231_4qef2c0.jpg', 10, 9, '2026-07-29 10:38:42'),
(142, 'photo_1785321522232_cf757vg.jpg', 10, 9, '2026-07-29 10:38:42'),
(143, 'photo_1785321522234_ihhir8g.jpg', 10, 9, '2026-07-29 10:38:42'),
(144, 'photo_1785321522236_quuly9v.jpg', 10, 9, '2026-07-29 10:38:42'),
(145, 'photo_1785321561483_99hwdnw.jpg', 10, 9, '2026-07-29 10:39:21'),
(146, 'photo_1785321561484_i6yho3m.jpg', 10, 9, '2026-07-29 10:39:21'),
(147, 'photo_1785321561485_2oo4gy6.jpg', 10, 9, '2026-07-29 10:39:21'),
(148, 'photo_1785321561486_20fy0hu.jpg', 10, 9, '2026-07-29 10:39:21'),
(149, 'photo_1785321561486_75nzh42.jpg', 10, 9, '2026-07-29 10:39:21'),
(150, 'photo_1785321561487_nhfcpcy.jpg', 10, 9, '2026-07-29 10:39:21'),
(151, 'photo_1785321561488_ylqlep4.jpg', 10, 9, '2026-07-29 10:39:21'),
(152, 'photo_1785321561489_gl3zucn.jpg', 10, 9, '2026-07-29 10:39:21'),
(153, 'photo_1785321561490_1e6m29c.jpg', 10, 9, '2026-07-29 10:39:21'),
(154, 'photo_1785321561491_veyzp99.jpg', 10, 9, '2026-07-29 10:39:21'),
(155, 'photo_1785321561495_7v7cqs3.jpg', 10, 9, '2026-07-29 10:39:21'),
(156, 'photo_1785321561499_17a6fxq.jpg', 10, 9, '2026-07-29 10:39:21'),
(157, 'photo_1785321561501_ny9o4aa.jpg', 10, 9, '2026-07-29 10:39:21'),
(158, 'photo_1785321561506_jrl2zbi.jpg', 10, 9, '2026-07-29 10:39:21'),
(226, 'photo_1785987220767_wt67gkt.jpg', 15, 11, '2026-08-06 03:33:46'),
(227, 'photo_1785987221456_3x7mmwt.jpg', 15, 11, '2026-08-06 03:33:46'),
(228, 'photo_1785987222147_skj2och.jpg', 15, 11, '2026-08-06 03:33:46'),
(229, 'photo_1785987222415_va6nzkw.jpg', 15, 11, '2026-08-06 03:33:46'),
(230, 'photo_1785987222682_kjyfpyv.jpg', 15, 11, '2026-08-06 03:33:46'),
(231, 'photo_1785987222962_vof9q4e.jpg', 15, 11, '2026-08-06 03:33:46'),
(232, 'photo_1785987223252_jb5v4us.jpg', 15, 11, '2026-08-06 03:33:46'),
(233, 'photo_1785987223546_05ij55i.jpg', 15, 11, '2026-08-06 03:33:46'),
(234, 'photo_1785987223809_h9ywqng.jpg', 15, 11, '2026-08-06 03:33:46'),
(235, 'photo_1785987224109_lxz8454.jpg', 15, 11, '2026-08-06 03:33:46'),
(236, 'photo_1785987224401_sj5vguo.jpg', 15, 11, '2026-08-06 03:33:46'),
(237, 'photo_1785987224698_mvfc7s4.jpg', 15, 11, '2026-08-06 03:33:46'),
(238, 'photo_1785987224995_claw8sk.jpg', 15, 11, '2026-08-06 03:33:46'),
(239, 'photo_1785987225286_w6va6cq.jpg', 15, 11, '2026-08-06 03:33:46'),
(240, 'photo_1785987225584_kjb2pce.jpg', 15, 11, '2026-08-06 03:33:46'),
(241, 'photo_1785987225851_rmncugb.jpg', 15, 11, '2026-08-06 03:33:46'),
(242, 'photo_1785987226113_okd6ap5.jpg', 15, 11, '2026-08-06 03:33:46'),
(243, 'photo_1786037318613_5gyxyl7.jpg', 16, 11, '2026-08-06 17:28:41'),
(244, 'photo_1786037318791_oqv4fle.jpg', 16, 11, '2026-08-06 17:28:41'),
(245, 'photo_1786037319026_si77og2.jpg', 16, 11, '2026-08-06 17:28:41'),
(246, 'photo_1786037319237_tydz8y4.jpg', 16, 11, '2026-08-06 17:28:41'),
(247, 'photo_1786037319416_y2dgt7k.jpg', 16, 11, '2026-08-06 17:28:41'),
(248, 'photo_1786037319624_fou1hou.jpg', 16, 11, '2026-08-06 17:28:41'),
(249, 'photo_1786037319797_hswbe90.jpg', 16, 11, '2026-08-06 17:28:41'),
(250, 'photo_1786037320000_7ulbawx.jpg', 16, 11, '2026-08-06 17:28:41'),
(251, 'photo_1786037320189_7ussobi.jpg', 16, 11, '2026-08-06 17:28:41'),
(252, 'photo_1786037320354_pxvet8i.jpg', 16, 11, '2026-08-06 17:28:41'),
(253, 'photo_1786037320551_w10ooo9.jpg', 16, 11, '2026-08-06 17:28:41'),
(254, 'photo_1786037320704_q7buv8n.jpg', 16, 11, '2026-08-06 17:28:41'),
(255, 'photo_1786037320865_0u1bksr.jpg', 16, 11, '2026-08-06 17:28:41'),
(256, 'photo_1786037321043_0086hcj.jpg', 16, 11, '2026-08-06 17:28:41'),
(257, 'photo_1786037321210_o7cota8.jpg', 16, 11, '2026-08-06 17:28:41'),
(258, 'photo_1786091849384_6jlcg0m.jpg', 15, 11, '2026-08-07 08:37:29'),
(259, 'photo_1786091879827_y13ia5m.jpg', 15, 11, '2026-08-07 08:38:00'),
(260, 'photo_1786091880010_d0u9f57.jpg', 15, 11, '2026-08-07 08:38:00'),
(261, 'photo_1786091880190_glf4fqq.jpg', 15, 11, '2026-08-07 08:38:00'),
(262, 'photo_1786091880361_rowrebs.jpg', 15, 11, '2026-08-07 08:38:00'),
(263, 'photo_1786167902251_kwnruf4.jpg', 16, 11, '2026-08-08 05:45:02'),
(264, 'photo_1786168190839_qkq2t41.jpg', 16, 11, '2026-08-08 05:49:51'),
(266, 'photo_1786168364779_9yy2kgz.jpg', 16, 11, '2026-08-08 05:52:45'),
(267, 'photo_1786168816481_s4qkl4y.jpg', 16, 11, '2026-08-08 06:00:16');

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
-- Indexes for table `indexing_jobs`
--
ALTER TABLE `indexing_jobs`
  ADD PRIMARY KEY (`job_key`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `event_access`
--
ALTER TABLE `event_access`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `event_collaborators`
--
ALTER TABLE `event_collaborators`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `face`
--
ALTER TABLE `face`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=511;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=268;

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
