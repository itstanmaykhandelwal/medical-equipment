-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 13, 2026 at 05:47 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `passive_wealth_ventures`
--

-- --------------------------------------------------------

--
-- Table structure for table `bento_cards`
--

CREATE TABLE `bento_cards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section` varchar(50) NOT NULL DEFAULT 'invest',
  `icon` varchar(20) NOT NULL DEFAULT '?',
  `title` varchar(200) NOT NULL,
  `body` text NOT NULL,
  `badge_text` varchar(100) DEFAULT NULL,
  `link_text` varchar(100) DEFAULT NULL,
  `link_url` varchar(500) NOT NULL DEFAULT '#',
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `author_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('passive-wealth-ventures-cache-setting_about_subtitle', 's:155:\"Passive Wealth Ventures adheres to relevant guidelines\n                and strives for transparency in our processes, empowering you to invest confidently.\";', 1791632512),
('passive-wealth-ventures-cache-setting_about_title', 's:42:\"Licensed and regulated for safer investing\";', 1791632512),
('passive-wealth-ventures-cache-setting_blog_section_title', 's:24:\"Latest news and articles\";', 1791632512),
('passive-wealth-ventures-cache-setting_buy_cta', 's:11:\"Get started\";', 1791632512),
('passive-wealth-ventures-cache-setting_buy_subtitle', 's:113:\"A powerful app for all your crypto\n                        needs: earn, set price targets, and build your wealth.\";', 1791632512),
('passive-wealth-ventures-cache-setting_buy_title', 's:37:\"More than one way to invest in crypto\";', 1791632512),
('passive-wealth-ventures-cache-setting_community_subtitle', 's:124:\"Join a network of investors and\n                    shareholders focused on sustainable growth and long-term value creation.\";', 1791632512),
('passive-wealth-ventures-cache-setting_community_title', 's:28:\"A Growing Investor Community\";', 1791632512),
('passive-wealth-ventures-cache-setting_disclaimer_cta', 's:10:\"Learn more\";', 1791632512),
('passive-wealth-ventures-cache-setting_disclaimer_text', 's:176:\"Investment in crypto-assets is\n                        unregulated, may not be suitable for retail investors and the entire amount invested may be\n                        lost.\";', 1791632512),
('passive-wealth-ventures-cache-setting_disclaimer_title', 's:10:\"Disclaimer\";', 1791632512),
('passive-wealth-ventures-cache-setting_faq_title', 's:26:\"Frequently asked questions\";', 1791632512),
('passive-wealth-ventures-cache-setting_footer_social_facebook', 's:1:\"#\";', 1791632512),
('passive-wealth-ventures-cache-setting_footer_social_instagram', 's:1:\"#\";', 1791632512),
('passive-wealth-ventures-cache-setting_footer_social_linkedin', 's:1:\"#\";', 1791632512),
('passive-wealth-ventures-cache-setting_footer_social_telegram', 's:1:\"#\";', 1791632512),
('passive-wealth-ventures-cache-setting_footer_social_twitter', 's:1:\"#\";', 1791632512),
('passive-wealth-ventures-cache-setting_footer_social_youtube', 's:1:\"#\";', 1791632512),
('passive-wealth-ventures-cache-setting_footer_tagline', 's:108:\"Your trusted crypto investment\n                        platform — safe, transparent, and built for growth.\";', 1791632512),
('passive-wealth-ventures-cache-setting_hero_badge', 's:23:\"Passive Wealth Ventures\";', 1791632512),
('passive-wealth-ventures-cache-setting_hero_cta_primary', 's:7:\"Sign Up\";', 1791632512),
('passive-wealth-ventures-cache-setting_hero_cta_secondary', 's:6:\"Log In\";', 1791632512),
('passive-wealth-ventures-cache-setting_hero_subtitle', 's:216:\"Passive Wealth Ventures provides strategic\n                        investment opportunities and shareholder participation designed to create sustainable growth and\n                        long-term financial success.\";', 1791632512),
('passive-wealth-ventures-cache-setting_hero_title', 's:50:\"Build Wealth\nBeyond\n                    Boundaries\";', 1791632512),
('passive-wealth-ventures-cache-setting_invest_cta', 's:11:\"Get started\";', 1791632512),
('passive-wealth-ventures-cache-setting_invest_subtitle', 's:121:\"Passive Wealth Ventures finds the\n                        best prices across exchanges and lets you automate investments.\";', 1791632512),
('passive-wealth-ventures-cache-setting_invest_title', 's:35:\"The easiest way to invest in crypto\";', 1791632512),
('passive-wealth-ventures-cache-setting_markets_subtitle', 's:88:\"Check prices, market statistics, and\n                    invest in your favorite tokens.\";', 1791632512),
('passive-wealth-ventures-cache-setting_markets_table_heading', 's:18:\"Live Market Prices\";', 1791632512),
('passive-wealth-ventures-cache-setting_markets_title', 's:40:\"More than 78,948 trading pairs available\";', 1791632512),
('passive-wealth-ventures-cache-setting_markets_view_all_text', 's:16:\"View All Markets\";', 1791632512),
('passive-wealth-ventures-cache-setting_markets_view_all_url', 's:1:\"#\";', 1791632512),
('passive-wealth-ventures-cache-setting_nav_link_1', 's:6:\"Invest\";', 1791632512),
('passive-wealth-ventures-cache-setting_nav_link_2', 's:20:\"Buy and Spend Crypto\";', 1791632512),
('passive-wealth-ventures-cache-setting_nav_link_3', 's:7:\"Markets\";', 1791632512),
('passive-wealth-ventures-cache-setting_nav_link_4', 's:9:\"Resources\";', 1791632512),
('passive-wealth-ventures-cache-setting_nav_link_5', 's:8:\"About us\";', 1791632512),
('passive-wealth-ventures-cache-setting_press_title', 's:22:\"Our Partners & Network\";', 1791632512),
('passive-wealth-ventures-cache-setting_registration_enabled', 'i:1;', 1791633025),
('passive-wealth-ventures-cache-setting_security_subtitle', 's:122:\"We use enterprise-grade security\n                        technology to protect your assets and personal data at all times.\";', 1791632512),
('passive-wealth-ventures-cache-setting_security_title', 's:29:\"Your security is our priority\";', 1791632512),
('passive-wealth-ventures-cache-setting_site_favicon', 'N;', 1791633022),
('passive-wealth-ventures-cache-setting_site_logo', 'N;', 1791633022),
('passive-wealth-ventures-cache-setting_site_name', 's:23:\"Passive Wealth Ventures\";', 1791632512),
('passive-wealth-ventures-cache-setting_stat_1_label', 's:30:\"Total user crypto assets value\";', 1791632512),
('passive-wealth-ventures-cache-setting_stat_1_value', 's:10:\"1108000000\";', 1791632512),
('passive-wealth-ventures-cache-setting_stat_2_label', 's:14:\"Verified users\";', 1791632512),
('passive-wealth-ventures-cache-setting_stat_2_value', 's:6:\"914300\";', 1791632512),
('passive-wealth-ventures-cache-setting_stat_3_label', 's:12:\"BORG holders\";', 1791632512),
('passive-wealth-ventures-cache-setting_stat_3_value', 's:6:\"222600\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card1_check1_desc', 's:87:\"Buy, sell & exchange always at\n                                the best available price\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card1_check1_title', 's:14:\"Best execution\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card1_check2_desc', 's:67:\"No need to search across\n                                platforms.\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card1_check2_title', 's:60:\"One platform, all the\n                                tokens\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card1_check3_desc', 's:79:\"Download Passive Wealth\n                                Ventures. Trade easily.\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card1_check3_title', 's:21:\"Cashback on your fees\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card1_cta', 's:24:\"Discover smarter trading\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card1_image', 's:0:\"\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card1_subtitle', 's:206:\"Our Smart Engine finds the best\n                            execution route across top exchanges, so you can buy, sell and trade crypto at the most\n                            competitive price, every time.\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card1_title', 's:74:\"Buy, sell and trade at the best rates\n                            possible\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card2_body', 's:139:\"Set your target price in advance and let\n                            Passive Wealth Ventures execute your buy or sell orders automatically.\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card2_cta', 's:22:\"Explore Trigger Orders\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card2_image', 's:0:\"\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card2_title', 's:19:\"Trade automatically\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card3_body', 's:94:\"Auto-Invest uses Dollar Cost Averaging\n                            (DCA) to reduce volatility.\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card3_cta', 's:20:\"Start auto-investing\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card3_image', 's:0:\"\";', 1791632512),
('passive-wealth-ventures-cache-setting_trading_card3_title', 's:25:\"Automate your Investments\";', 1791632512);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `career_jobs`
--

CREATE TABLE `career_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `department` varchar(100) NOT NULL,
  `tags` varchar(300) DEFAULT NULL,
  `salary` varchar(100) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `career_perks`
--

CREATE TABLE `career_perks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `icon` varchar(20) NOT NULL DEFAULT '?',
  `title` varchar(100) NOT NULL,
  `body` text NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coin_rates`
--

CREATE TABLE `coin_rates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rate` decimal(10,4) NOT NULL DEFAULT 0.0100,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coin_rate_histories`
--

CREATE TABLE `coin_rate_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rate` decimal(18,8) NOT NULL,
  `changed_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coin_swap_requests`
--

CREATE TABLE `coin_swap_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `buyer_id` bigint(20) UNSIGNED NOT NULL,
  `seller_id` bigint(20) UNSIGNED NOT NULL,
  `usdt_amount` decimal(18,4) NOT NULL,
  `coin_amount` decimal(18,4) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0=pending,1=approved,2=cancelled',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `community_images`
--

CREATE TABLE `community_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `caption` varchar(200) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_queries`
--

CREATE TABLE `contact_queries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','closed') NOT NULL DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deposits`
--

CREATE TABLE `deposits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `deposit_id` varchar(255) NOT NULL,
  `amount` decimal(18,8) NOT NULL,
  `method` varchar(100) NOT NULL DEFAULT 'usdt_trc20',
  `wallet_address` varchar(255) DEFAULT NULL,
  `txn_hash` varchar(255) DEFAULT NULL,
  `screenshot` varchar(255) DEFAULT NULL,
  `status` enum('pending','processing','completed','rejected') NOT NULL DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `draws`
--

CREATE TABLE `draws` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `ticket_price` decimal(18,2) NOT NULL DEFAULT 0.00,
  `prize_pool` decimal(18,2) NOT NULL DEFAULT 0.00,
  `draw_date` datetime NOT NULL,
  `status` enum('upcoming','active','completed','cancelled') NOT NULL DEFAULT 'upcoming',
  `winners` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`winners`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `draw_tickets`
--

CREATE TABLE `draw_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `draw_id` bigint(20) UNSIGNED NOT NULL,
  `ticket_number` varchar(255) NOT NULL,
  `amount_paid` decimal(18,2) NOT NULL DEFAULT 0.00,
  `is_winner` tinyint(1) NOT NULL DEFAULT 0,
  `prize_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
  `spin_claimed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `footer_links`
--

CREATE TABLE `footer_links` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `column` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `footer_links`
--

INSERT INTO `footer_links` (`id`, `column`, `label`, `url`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'investment_solutions', 'Smart Exchange', '#invest', 1, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(2, 'investment_solutions', 'Auto-Invest', '#invest', 2, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(3, 'investment_solutions', 'Trigger Orders', '#invest', 3, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(4, 'investment_solutions', 'Earn Yield', '#buy-crypto', 4, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(5, 'investment_solutions', 'Crypto Bundles', '#buy-crypto', 5, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(6, 'investment_solutions', 'Crypto Card', '#buy-crypto', 6, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(7, 'resources', 'Help Centre', '/help', 1, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(8, 'resources', 'Blog', '/blog', 2, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(9, 'resources', 'FAQ', '#resources', 3, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(10, 'resources', 'Markets', '#markets', 4, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(11, 'resources', 'Contact Us', '/contact', 5, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(12, 'company', 'About Us', '/about', 1, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(13, 'company', 'Careers', '/careers', 2, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(14, 'company', 'Regulation', '/about#regulation', 3, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(15, 'company', 'Contact', '/contact', 4, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(16, 'shareholders', 'Share Ownership', '/register', 1, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(17, 'shareholders', 'Dividend Program', '#invest', 2, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(18, 'shareholders', 'Investor Dashboard', '/login', 3, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(19, 'shareholders', 'Shareholder Benefits', '#invest', 4, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(20, 'legal', 'Privacy Policy', '/privacy-policy', 1, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(21, 'legal', 'Terms of Use', '/terms-and-conditions', 2, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(22, 'legal', 'Cookie Policy', '/cookies', 3, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(23, 'legal', 'Compliance', '/about#regulation', 4, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32');

-- --------------------------------------------------------

--
-- Table structure for table `fund_transfers`
--

CREATE TABLE `fund_transfers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `from_user_id` bigint(20) UNSIGNED NOT NULL,
  `to_user_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(18,8) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `status` enum('completed','failed') NOT NULL DEFAULT 'completed',
  `transfer_type` varchar(255) NOT NULL DEFAULT 'wallet',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `income_payout_requests`
--

CREATE TABLE `income_payout_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `source` enum('plan_roi','level_income','all') NOT NULL DEFAULT 'all',
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `request_id` varchar(255) NOT NULL,
  `admin_note` text DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `investment_plans`
--

CREATE TABLE `investment_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `min_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
  `max_amount` decimal(18,2) DEFAULT NULL,
  `daily_return` decimal(8,4) NOT NULL DEFAULT 0.0000,
  `total_return` decimal(8,4) NOT NULL DEFAULT 0.0000,
  `profit_label` varchar(255) DEFAULT NULL,
  `duration_days` int(11) NOT NULL DEFAULT 30,
  `duration_hours` int(10) UNSIGNED DEFAULT NULL,
  `type` enum('contract','mining','staking') NOT NULL DEFAULT 'contract',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `investment_profit_logs`
--

CREATE TABLE `investment_profit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_investment_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `investment_plan_id` bigint(20) UNSIGNED NOT NULL,
  `profit_amount` decimal(12,8) NOT NULL,
  `due_date` date NOT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kyc_documents`
--

CREATE TABLE `kyc_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `document_type` enum('aadhar','pan','passport','driving_license','voter_id','other','manual_verification') NOT NULL,
  `document_number` varchar(255) NOT NULL,
  `front_image` varchar(255) DEFAULT NULL,
  `back_image` varchar(255) DEFAULT NULL,
  `selfie_image` varchar(255) DEFAULT NULL,
  `status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `level_incomes`
--

CREATE TABLE `level_incomes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `from_user_id` bigint(20) UNSIGNED NOT NULL,
  `investment_id` bigint(20) UNSIGNED NOT NULL,
  `level` int(11) NOT NULL,
  `investment_amount` decimal(18,8) NOT NULL,
  `percentage` decimal(8,4) NOT NULL,
  `income_amount` decimal(18,8) NOT NULL,
  `status` enum('pending','credited') NOT NULL DEFAULT 'credited',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `level_income_settings`
--

CREATE TABLE `level_income_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `level` int(11) NOT NULL,
  `percentage` decimal(8,4) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `market_tickers`
--

CREATE TABLE `market_tickers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `symbol` varchar(15) NOT NULL,
  `price` decimal(18,4) NOT NULL,
  `change_pct` decimal(6,2) NOT NULL,
  `market_cap` decimal(20,0) NOT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `market_tickers`
--

INSERT INTO `market_tickers` (`id`, `name`, `symbol`, `price`, `change_pct`, `market_cap`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Bitcoin', 'BTC', 69806.6500, -4.04, 1398800000000, 1, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(2, 'Ethereum', 'ETH', 1978.4900, 0.11, 238770000000, 2, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(3, 'Solana', 'SOL', 178.3200, 3.12, 82450000000, 3, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(4, 'USD Coin', 'USDC', 1.0000, 0.00, 75852000000, 4, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_01_000001_create_users_table_pgw', 1),
(5, '2024_01_01_000002_create_settings_table', 1),
(6, '2024_01_01_000003_create_investment_plans_table', 1),
(7, '2024_01_01_000004_create_user_investments_table', 1),
(8, '2024_01_01_000005_create_transactions_table', 1),
(9, '2024_01_01_000006_create_withdrawals_table', 1),
(10, '2024_01_01_000007_create_deposits_table', 1),
(11, '2024_01_01_000008_create_fund_transfers_table', 1),
(12, '2024_01_01_000009_create_level_incomes_table', 1),
(13, '2024_01_01_000010_create_kyc_documents_table', 1),
(14, '2024_01_01_000011_create_notifications_table_pgw', 1),
(15, '2024_01_01_000012_create_draw_tickets_table', 1),
(16, '2024_01_01_000013_create_rewards_table', 1),
(17, '2024_01_01_000014_create_support_tickets_table', 1),
(18, '2024_01_01_000015_create_content_tables', 1),
(19, '2024_01_02_000001_create_testimonials_table', 1),
(20, '2026_06_03_121836_update_withdrawal_method_enum', 1),
(21, '2026_06_10_094302_create_investment_profit_logs_table', 1),
(22, '2026_06_12_000001_create_coin_swap_tables', 1),
(23, '2026_06_12_090039_create_payment_options_table', 1),
(24, '2026_06_12_091112_create_packages_table', 1),
(25, '2026_06_12_091113_create_package_requests_table', 1),
(26, '2026_06_12_094159_add_withdrawal_type_to_withdrawals_table', 1),
(27, '2026_06_12_095603_create_income_payout_requests_table', 1),
(28, '2026_06_12_102028_create_coin_rate_histories_table', 1),
(29, '2026_06_12_102757_add_reactivation_fields_to_users_table', 1),
(30, '2026_06_12_104112_change_method_column_in_deposits_table', 1),
(31, '2026_06_12_105208_create_reactivation_histories_table', 1),
(32, '2026_06_12_112319_add_transfer_type_to_fund_transfers_table', 1),
(33, '2026_06_12_113541_create_withdrawal_addresses_table', 1),
(34, '2026_06_18_000001_create_pages_table', 1),
(35, '2026_06_22_050615_create_security_cards_table', 1),
(36, '2026_06_22_050616_create_bento_cards_table', 1),
(37, '2026_06_22_050616_create_press_logos_table', 1),
(38, '2026_06_23_174623_create_user_shares_table', 1),
(39, '2026_06_24_000001_create_community_images_table', 1),
(40, '2026_06_24_154339_create_career_perks_table', 1),
(41, '2026_06_24_154340_create_career_jobs_table', 1),
(42, '2026_06_25_100001_create_pwv_price_history_table', 1),
(43, '2026_06_28_000001_create_footer_links_table', 1),
(44, '2026_06_28_000002_create_top_crypto_cards_table', 1),
(45, '2026_06_28_000003_create_market_tickers_table', 1),
(46, '2026_07_01_000001_add_duration_hours_to_investment_plans', 1),
(47, '2026_07_01_000002_add_missing_types_to_transactions', 1),
(48, '2026_07_02_000001_add_profit_wallets_to_users', 1),
(49, '2026_07_02_000002_add_wallet_source_to_withdrawals', 1),
(50, '2026_07_02_000003_add_profit_types_to_transactions', 1),
(51, '2026_09_09_000001_create_registration_requests_table', 1),
(52, '2026_09_10_000001_allow_shared_email_add_user_code', 1),
(53, '2026_09_12_000001_add_shareholding_claim_transaction_type', 1),
(54, '2026_09_13_000001_add_is_free_to_packages_table', 1),
(55, '2026_09_13_000002_add_trial_fields_to_users_table', 1),
(56, '2026_09_13_000003_add_expired_to_users_status_enum', 1),
(57, '2026_09_13_000004_add_category_to_user_shares_table', 1),
(58, '2026_09_18_000001_create_share_allotment_history_table', 1),
(59, '2026_09_19_000001_add_more_categories_to_user_shares_table', 1),
(60, '2026_09_21_000001_create_newsletter_subscribers_table', 1),
(61, '2026_09_22_000001_add_spin_claimed_at_to_draw_tickets_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `description` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `is_free` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `package_requests`
--

CREATE TABLE `package_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `package_id` bigint(20) UNSIGNED NOT NULL,
  `txn_id` varchar(255) DEFAULT NULL,
  `payment_proof` varchar(255) DEFAULT NULL,
  `status` enum('pending','paid','rejected') NOT NULL DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_options`
--

CREATE TABLE `payment_options` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `wallet_address` varchar(255) NOT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `press_logos`
--

CREATE TABLE `press_logos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `url` varchar(500) NOT NULL DEFAULT '#',
  `image_url` varchar(500) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pwv_price_history`
--

CREATE TABLE `pwv_price_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `old_price` decimal(16,6) NOT NULL,
  `new_price` decimal(16,6) NOT NULL,
  `change_amount` decimal(16,6) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `triggered_by` varchar(255) DEFAULT NULL,
  `shares_qty` decimal(16,4) DEFAULT NULL,
  `beneficiary` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reactivation_histories`
--

CREATE TABLE `reactivation_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `deposit_id` varchar(255) DEFAULT NULL,
  `actioned_by` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `registration_requests`
--

CREATE TABLE `registration_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `referred_by` bigint(20) UNSIGNED DEFAULT NULL,
  `package_id` bigint(20) UNSIGNED DEFAULT NULL,
  `txn_id` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `min_direct_team` decimal(10,2) NOT NULL DEFAULT 0.00,
  `min_business_volume` decimal(18,2) NOT NULL DEFAULT 0.00,
  `reward_value` decimal(18,2) NOT NULL DEFAULT 0.00,
  `reward_type` varchar(255) NOT NULL DEFAULT 'cash',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `security_cards`
--

CREATE TABLE `security_cards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `icon` varchar(20) NOT NULL DEFAULT '?',
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('6VdiXIa0MPj3EJzLmmbdjLGEKHwnX8uREiOilfJf', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2N4Q05NTUVLWUpiMlVvblZQNjZTb2gwSjdpQmhkaGg5cUVHNUFXQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo4OiJob21lUGFnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791217486),
('B6xXRkHlXFutf2ByKXcdhx6CyIgbGGaN5WoBLSDN', NULL, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS2lFNGl2VTZkZXZYSU93RzdLQzhEakdydUtuQVQ0RVZzajBQdmdXdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo4OiJob21lUGFnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790418156),
('BVquFKaJdkkhUDnSyabV48MhGLWVRMYOuIjom45z', NULL, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRmdSVWJwS1V0U1lLbTZJYmJMQkFVWU4wc2Q1UkROMTlUWkY3eENqNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo4OiJob21lUGFnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790011050),
('Dr7PxqaaHZ4uIRxU0i7r9eXAohoXxlKS8P9bdTxR', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmFPcUFSMzNFdEM2cDcySjlscWw1b0dWWFF5UGhaUjVwMWJPeTdhZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo4OiJob21lUGFnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790097218),
('eHdDLl8NkWnw0ss24JDBcy5jjcUOmRJgeCQckp55', NULL, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUlFTUVBQa0ZKaWFmajFzV2RtQ2RXd0U2WVFDMmFnckRHYk85dGFjeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo4OiJob21lUGFnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790494325),
('FWGOBP54q9XWw4sxqFSw036S8te7xs7Mua6xxj97', NULL, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHNXUXFHYlZKTks5dzF1VVdwbVN6eHoxS1RBbEJ5R0dRSnlwMDEySyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hZG1pbi9sb2dpbiI7czo1OiJyb3V0ZSI7czoxMToiYWRtaW4ubG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1791619885),
('KiQlWC1eELGXXGrDxWjhFZ3HJJCyyYa6umu2tR4z', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 14; SM-A556B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQzJXZURDTE42d056d1oxcnpTT2RFMXRIdVdkeW1nbVl6QUFwSU1YdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo4OiJob21lUGFnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790096706),
('kwJ9WDt32qah7E00i7ViCd8uum1ZCli8WnGqOg6j', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU2RpOGkxSU0zOVh1VWlYZ280dlRLV1hwUm9SUVZkN2hvN3NTa0FHUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo4OiJob21lUGFnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790493841),
('o9ghGDMuT0ib9Xb6WrXmuI7CD9sZDsuyfeU6sllg', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQTVIb0hON1pXd3RaY21QSjR0bko2WVY0Y0lSWFN4cVY2emdDQ0R0aCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791629525),
('UZHQ17peKRsVPqi5VX0Z7KljF2zVBaVIZAtv3K0T', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 14; SM-A556B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibjZNUzFsdXFFVGh3MnBPNU91TXFnSWVlSGtCaWdYRTBDa1JuYVZReiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo4OiJob21lUGFnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790010959),
('v80x1qcuwDeWqmh6K4xK9f79kGI9cbdlQMpEtCer', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidlZyejI3UUFvZUNiZzU0RUtWVkJVRXJwcWZqT3BjMzhnd1VQYXdtayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo4OiJob21lUGFnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790180015),
('VmGbZO6w3ygMyqXqjAxmoBN1MNy0Bn9MtzYLTuD1', NULL, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSVlsU1poVEtvazUwWkY3TEt3R1hudFllR1k5a3dpSWlLVDFUbG5aNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo4OiJob21lUGFnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790436424);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `group` varchar(255) NOT NULL DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `share_allotment_history`
--

CREATE TABLE `share_allotment_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `shares_added` decimal(16,4) NOT NULL,
  `invested_added` decimal(16,2) NOT NULL,
  `shares_total_after` decimal(16,4) NOT NULL,
  `invested_total_after` decimal(16,2) NOT NULL,
  `price_at_allotment` decimal(16,6) NOT NULL,
  `category` varchar(255) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sliders`
--

CREATE TABLE `sliders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `button_text` varchar(255) DEFAULT NULL,
  `button_link` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_replies`
--

CREATE TABLE `support_replies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ticket_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `ticket_id` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `category` enum('general','payment','technical','account','investment') NOT NULL DEFAULT 'general',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `assigned_to` bigint(20) UNSIGNED DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `rating` tinyint(4) NOT NULL DEFAULT 5,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `top_crypto_cards`
--

CREATE TABLE `top_crypto_cards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `icon_text` varchar(5) NOT NULL,
  `name` varchar(255) NOT NULL,
  `symbol` varchar(15) NOT NULL,
  `price` decimal(18,2) NOT NULL,
  `change_pct` decimal(6,2) NOT NULL,
  `earn_badge` varchar(255) DEFAULT NULL,
  `trade_url` varchar(255) NOT NULL DEFAULT '#',
  `learn_url` varchar(255) NOT NULL DEFAULT '#',
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `top_crypto_cards`
--

INSERT INTO `top_crypto_cards` (`id`, `icon_text`, `name`, `symbol`, `price`, `change_pct`, `earn_badge`, `trade_url`, `learn_url`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '₿', 'Bitcoin', 'BTC', 69402.91, -4.44, NULL, '#', '#', 1, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(2, 'Ξ', 'Ethereum', 'ETH', 1976.88, -0.31, '⚡ EARN UP TO 1.79%', '#', '#', 2, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32'),
(3, 'H', 'Hyperliquid', 'HYPE', 72.29, -1.43, '📈 EARN UP TO 1.77%', '#', '#', 3, 1, '2026-09-21 11:32:32', '2026-09-21 11:32:32');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `txn_id` varchar(255) NOT NULL,
  `type` enum('deposit','withdrawal','investment','profit','referral_bonus','level_income','reward','fund_transfer_in','fund_transfer_out','staking_reward','draw_ticket','refund','coin_exchange','coin_swap_sell','coin_swap_buy','mining_profit','contract_completed','contract_transfer_in','contract_transfer_out','income_release','mining_income','staking_profit','contract_profit','shareholding_profit','airdrop_claim','draw_prize','shareholding_claim') NOT NULL DEFAULT 'deposit',
  `amount` decimal(18,8) NOT NULL,
  `balance_before` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `balance_after` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `description` varchar(255) DEFAULT NULL,
  `reference_id` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'completed',
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_code` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `referral_code` varchar(20) DEFAULT NULL,
  `referred_by` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet_balance` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `coin_balance` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `staking_profit_balance` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `contract_profit_balance` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `shareholding_profit_balance` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `total_deposited` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `total_withdrawn` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `total_income` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `referral_earnings` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `kyc_status` enum('pending','submitted','verified','rejected') NOT NULL DEFAULT 'pending',
  `two_fa_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `two_fa_secret` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `status` enum('active','inactive','suspended','expired') NOT NULL DEFAULT 'active',
  `trial_ends_at` timestamp NULL DEFAULT NULL,
  `trial_warning_48h_sent_at` timestamp NULL DEFAULT NULL,
  `trial_warning_24h_sent_at` timestamp NULL DEFAULT NULL,
  `needs_reactivation` tinyint(1) NOT NULL DEFAULT 0,
  `reactivation_amount` decimal(12,2) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_investments`
--

CREATE TABLE `user_investments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `investment_plan_id` bigint(20) UNSIGNED NOT NULL,
  `contract_id` varchar(255) NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `daily_return_rate` decimal(8,4) NOT NULL,
  `total_return_rate` decimal(8,4) NOT NULL,
  `earned_so_far` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `total_to_earn` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `last_profit_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','completed','cancelled') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_notifications`
--

CREATE TABLE `user_notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','success','warning','danger') NOT NULL DEFAULT 'info',
  `icon` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_rewards`
--

CREATE TABLE `user_rewards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `reward_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `status` enum('pending','credited','claimed') NOT NULL DEFAULT 'credited',
  `claimed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_shares`
--

CREATE TABLE `user_shares` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `shares_owned` decimal(15,4) NOT NULL DEFAULT 0.0000,
  `invested_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `category` enum('founder','employee','investor','public','ipo','fpo','ofs','esop','agm','ebitda','roe','eps','pe_ratio','cagr','roa','nav','wacc','pb_ratio','de_ratio','roce','roic','dpr','arr','cfo','fcf','p_and_l','roi') NOT NULL DEFAULT 'public',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `withdrawals`
--

CREATE TABLE `withdrawals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `withdrawal_id` varchar(255) NOT NULL,
  `amount` decimal(18,8) NOT NULL,
  `fee` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `net_amount` decimal(18,8) NOT NULL,
  `method` enum('bank','crypto','paypal','manual') NOT NULL,
  `withdrawal_type` enum('income','principal') NOT NULL DEFAULT 'income',
  `wallet_source` varchar(30) NOT NULL DEFAULT 'main_wallet',
  `wallet_address` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(255) DEFAULT NULL,
  `txn_hash` varchar(255) DEFAULT NULL,
  `status` enum('pending','processing','completed','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal_addresses`
--

CREATE TABLE `withdrawal_addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(255) NOT NULL,
  `network` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bento_cards`
--
ALTER TABLE `bento_cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blog_posts_slug_unique` (`slug`),
  ADD KEY `blog_posts_author_id_foreign` (`author_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `career_jobs`
--
ALTER TABLE `career_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `career_perks`
--
ALTER TABLE `career_perks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coin_rates`
--
ALTER TABLE `coin_rates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coin_rate_histories`
--
ALTER TABLE `coin_rate_histories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coin_swap_requests`
--
ALTER TABLE `coin_swap_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `coin_swap_requests_buyer_id_foreign` (`buyer_id`),
  ADD KEY `coin_swap_requests_seller_id_foreign` (`seller_id`);

--
-- Indexes for table `community_images`
--
ALTER TABLE `community_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_queries`
--
ALTER TABLE `contact_queries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deposits`
--
ALTER TABLE `deposits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `deposits_deposit_id_unique` (`deposit_id`),
  ADD KEY `deposits_user_id_foreign` (`user_id`);

--
-- Indexes for table `draws`
--
ALTER TABLE `draws`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `draw_tickets`
--
ALTER TABLE `draw_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `draw_tickets_ticket_number_unique` (`ticket_number`),
  ADD KEY `draw_tickets_user_id_foreign` (`user_id`),
  ADD KEY `draw_tickets_draw_id_foreign` (`draw_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `footer_links`
--
ALTER TABLE `footer_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fund_transfers`
--
ALTER TABLE `fund_transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fund_transfers_from_user_id_foreign` (`from_user_id`),
  ADD KEY `fund_transfers_to_user_id_foreign` (`to_user_id`);

--
-- Indexes for table `income_payout_requests`
--
ALTER TABLE `income_payout_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `income_payout_requests_request_id_unique` (`request_id`),
  ADD KEY `income_payout_requests_user_id_foreign` (`user_id`);

--
-- Indexes for table `investment_plans`
--
ALTER TABLE `investment_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investment_profit_logs`
--
ALTER TABLE `investment_profit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `investment_profit_logs_user_id_foreign` (`user_id`),
  ADD KEY `investment_profit_logs_investment_plan_id_foreign` (`investment_plan_id`),
  ADD KEY `investment_profit_logs_user_investment_id_due_date_index` (`user_investment_id`,`due_date`),
  ADD KEY `investment_profit_logs_status_index` (`status`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kyc_documents`
--
ALTER TABLE `kyc_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kyc_documents_user_id_foreign` (`user_id`),
  ADD KEY `kyc_documents_reviewed_by_foreign` (`reviewed_by`);

--
-- Indexes for table `level_incomes`
--
ALTER TABLE `level_incomes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `level_incomes_user_id_foreign` (`user_id`),
  ADD KEY `level_incomes_from_user_id_foreign` (`from_user_id`),
  ADD KEY `level_incomes_investment_id_foreign` (`investment_id`);

--
-- Indexes for table `level_income_settings`
--
ALTER TABLE `level_income_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `level_income_settings_level_unique` (`level`);

--
-- Indexes for table `market_tickers`
--
ALTER TABLE `market_tickers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `newsletter_subscribers_email_unique` (`email`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `package_requests`
--
ALTER TABLE `package_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `package_requests_user_id_foreign` (`user_id`),
  ADD KEY `package_requests_package_id_foreign` (`package_id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pages_slug_unique` (`slug`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment_options`
--
ALTER TABLE `payment_options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_options_slug_unique` (`slug`);

--
-- Indexes for table `press_logos`
--
ALTER TABLE `press_logos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pwv_price_history`
--
ALTER TABLE `pwv_price_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reactivation_histories`
--
ALTER TABLE `reactivation_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reactivation_histories_user_id_foreign` (`user_id`);

--
-- Indexes for table `registration_requests`
--
ALTER TABLE `registration_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_requests_username_unique` (`username`),
  ADD KEY `registration_requests_referred_by_foreign` (`referred_by`),
  ADD KEY `registration_requests_package_id_foreign` (`package_id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `security_cards`
--
ALTER TABLE `security_cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indexes for table `share_allotment_history`
--
ALTER TABLE `share_allotment_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `share_allotment_history_admin_id_foreign` (`admin_id`),
  ADD KEY `share_allotment_history_user_id_created_at_index` (`user_id`,`created_at`);

--
-- Indexes for table `sliders`
--
ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support_replies`
--
ALTER TABLE `support_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `support_replies_ticket_id_foreign` (`ticket_id`),
  ADD KEY `support_replies_user_id_foreign` (`user_id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_tickets_ticket_id_unique` (`ticket_id`),
  ADD KEY `support_tickets_user_id_foreign` (`user_id`),
  ADD KEY `support_tickets_assigned_to_foreign` (`assigned_to`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `top_crypto_cards`
--
ALTER TABLE `top_crypto_cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactions_txn_id_unique` (`txn_id`),
  ADD KEY `transactions_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_referral_code_unique` (`referral_code`),
  ADD UNIQUE KEY `users_user_code_unique` (`user_code`),
  ADD KEY `users_referred_by_foreign` (`referred_by`);

--
-- Indexes for table `user_investments`
--
ALTER TABLE `user_investments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_investments_contract_id_unique` (`contract_id`),
  ADD KEY `user_investments_user_id_foreign` (`user_id`),
  ADD KEY `user_investments_investment_plan_id_foreign` (`investment_plan_id`);

--
-- Indexes for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_notifications_user_id_foreign` (`user_id`);

--
-- Indexes for table `user_rewards`
--
ALTER TABLE `user_rewards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_rewards_user_id_foreign` (`user_id`),
  ADD KEY `user_rewards_reward_id_foreign` (`reward_id`);

--
-- Indexes for table `user_shares`
--
ALTER TABLE `user_shares`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_shares_user_id_foreign` (`user_id`);

--
-- Indexes for table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `withdrawals_withdrawal_id_unique` (`withdrawal_id`),
  ADD KEY `withdrawals_user_id_foreign` (`user_id`);

--
-- Indexes for table `withdrawal_addresses`
--
ALTER TABLE `withdrawal_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `withdrawal_addresses_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bento_cards`
--
ALTER TABLE `bento_cards`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `career_jobs`
--
ALTER TABLE `career_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `career_perks`
--
ALTER TABLE `career_perks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coin_rates`
--
ALTER TABLE `coin_rates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coin_rate_histories`
--
ALTER TABLE `coin_rate_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coin_swap_requests`
--
ALTER TABLE `coin_swap_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `community_images`
--
ALTER TABLE `community_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_queries`
--
ALTER TABLE `contact_queries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deposits`
--
ALTER TABLE `deposits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `draws`
--
ALTER TABLE `draws`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `draw_tickets`
--
ALTER TABLE `draw_tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `footer_links`
--
ALTER TABLE `footer_links`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `fund_transfers`
--
ALTER TABLE `fund_transfers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `income_payout_requests`
--
ALTER TABLE `income_payout_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `investment_plans`
--
ALTER TABLE `investment_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `investment_profit_logs`
--
ALTER TABLE `investment_profit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kyc_documents`
--
ALTER TABLE `kyc_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `level_incomes`
--
ALTER TABLE `level_incomes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `level_income_settings`
--
ALTER TABLE `level_income_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `market_tickers`
--
ALTER TABLE `market_tickers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `package_requests`
--
ALTER TABLE `package_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_options`
--
ALTER TABLE `payment_options`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `press_logos`
--
ALTER TABLE `press_logos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pwv_price_history`
--
ALTER TABLE `pwv_price_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reactivation_histories`
--
ALTER TABLE `reactivation_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `registration_requests`
--
ALTER TABLE `registration_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `security_cards`
--
ALTER TABLE `security_cards`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `share_allotment_history`
--
ALTER TABLE `share_allotment_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_replies`
--
ALTER TABLE `support_replies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `top_crypto_cards`
--
ALTER TABLE `top_crypto_cards`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_investments`
--
ALTER TABLE `user_investments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_notifications`
--
ALTER TABLE `user_notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_rewards`
--
ALTER TABLE `user_rewards`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_shares`
--
ALTER TABLE `user_shares`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `withdrawals`
--
ALTER TABLE `withdrawals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `withdrawal_addresses`
--
ALTER TABLE `withdrawal_addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coin_swap_requests`
--
ALTER TABLE `coin_swap_requests`
  ADD CONSTRAINT `coin_swap_requests_buyer_id_foreign` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `coin_swap_requests_seller_id_foreign` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `deposits`
--
ALTER TABLE `deposits`
  ADD CONSTRAINT `deposits_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `draw_tickets`
--
ALTER TABLE `draw_tickets`
  ADD CONSTRAINT `draw_tickets_draw_id_foreign` FOREIGN KEY (`draw_id`) REFERENCES `draws` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `draw_tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fund_transfers`
--
ALTER TABLE `fund_transfers`
  ADD CONSTRAINT `fund_transfers_from_user_id_foreign` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fund_transfers_to_user_id_foreign` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `income_payout_requests`
--
ALTER TABLE `income_payout_requests`
  ADD CONSTRAINT `income_payout_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `investment_profit_logs`
--
ALTER TABLE `investment_profit_logs`
  ADD CONSTRAINT `investment_profit_logs_investment_plan_id_foreign` FOREIGN KEY (`investment_plan_id`) REFERENCES `investment_plans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `investment_profit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `investment_profit_logs_user_investment_id_foreign` FOREIGN KEY (`user_investment_id`) REFERENCES `user_investments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kyc_documents`
--
ALTER TABLE `kyc_documents`
  ADD CONSTRAINT `kyc_documents_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `kyc_documents_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `level_incomes`
--
ALTER TABLE `level_incomes`
  ADD CONSTRAINT `level_incomes_from_user_id_foreign` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `level_incomes_investment_id_foreign` FOREIGN KEY (`investment_id`) REFERENCES `user_investments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `level_incomes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `package_requests`
--
ALTER TABLE `package_requests`
  ADD CONSTRAINT `package_requests_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `package_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reactivation_histories`
--
ALTER TABLE `reactivation_histories`
  ADD CONSTRAINT `reactivation_histories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `registration_requests`
--
ALTER TABLE `registration_requests`
  ADD CONSTRAINT `registration_requests_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `registration_requests_referred_by_foreign` FOREIGN KEY (`referred_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `share_allotment_history`
--
ALTER TABLE `share_allotment_history`
  ADD CONSTRAINT `share_allotment_history_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `share_allotment_history_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_replies`
--
ALTER TABLE `support_replies`
  ADD CONSTRAINT `support_replies_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `support_replies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `support_tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_referred_by_foreign` FOREIGN KEY (`referred_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_investments`
--
ALTER TABLE `user_investments`
  ADD CONSTRAINT `user_investments_investment_plan_id_foreign` FOREIGN KEY (`investment_plan_id`) REFERENCES `investment_plans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_investments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD CONSTRAINT `user_notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_rewards`
--
ALTER TABLE `user_rewards`
  ADD CONSTRAINT `user_rewards_reward_id_foreign` FOREIGN KEY (`reward_id`) REFERENCES `rewards` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_rewards_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_shares`
--
ALTER TABLE `user_shares`
  ADD CONSTRAINT `user_shares_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD CONSTRAINT `withdrawals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `withdrawal_addresses`
--
ALTER TABLE `withdrawal_addresses`
  ADD CONSTRAINT `withdrawal_addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
