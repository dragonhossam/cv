-- CV Maker Pro - Hostinger MySQL Database Schema
-- Run this in phpMyAdmin or MySQL CLI

CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vodafone_cash_wallet` VARCHAR(50) NOT NULL DEFAULT '01012345678',
  `vodafone_cash_name` VARCHAR(100) NOT NULL DEFAULT 'CV Maker Official Account',
  `pro_price_egp` INT NOT NULL DEFAULT 49,
  `premium_price_egp` INT NOT NULL DEFAULT 99,
  `payment_instructions_ar` TEXT,
  `payment_instructions_en` TEXT,
  `admin_password_hash` VARCHAR(255) NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `package_id` VARCHAR(50) NOT NULL,
  `package_name` VARCHAR(100) NOT NULL,
  `amount_egp` DECIMAL(10,2) NOT NULL,
  `sender_phone` VARCHAR(50) NOT NULL,
  `transaction_id` VARCHAR(100) NOT NULL UNIQUE,
  `customer_email` VARCHAR(191) NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `status` ENUM('pending', 'paid', 'rejected') NOT NULL DEFAULT 'pending',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `approved_at` TIMESTAMP NULL DEFAULT NULL,
  INDEX `idx_order_status` (`status`),
  INDEX `idx_order_email` (`customer_email`),
  INDEX `idx_order_tx` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings row if empty (Default admin password: admin123)
INSERT INTO `settings` (`vodafone_cash_wallet`, `pro_price_egp`, `premium_price_egp`, `payment_instructions_ar`, `payment_instructions_en`, `admin_password_hash`)
VALUES (
  '01012345678',
  49,
  99,
  'قم بتحويل المبلغ المطلوب إلى رقم محفظة فودافون كاش الموضحة أعلاه، ثم أدخل رقم هاتفك المحول منه ورقم العملية لتأكيد طلبك وتفعيل باقتك فوراً.',
  'Transfer the required amount to the Vodafone Cash wallet number above, then enter your sender phone number and Transaction ID to activate your plan.',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
) ON DUPLICATE KEY UPDATE `id`=`id`;
