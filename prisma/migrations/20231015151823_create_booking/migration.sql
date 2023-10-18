/*
  Warnings:

  - You are about to drop the column `equipment_departmentId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_equipment_departmentId_fkey`;

-- AlterTable
ALTER TABLE `equipment_method` ADD COLUMN `pricing` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `equipment_departmentId`;

-- CreateTable
CREATE TABLE `equipment_booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `equipment_id` INTEGER NOT NULL,
    `booking_date` DATETIME(3) NOT NULL,
    `example` LONGTEXT NULL,
    `prefix` VARCHAR(500) NULL,
    `firstname` VARCHAR(500) NULL,
    `surname` VARCHAR(500) NULL,
    `organization` VARCHAR(500) NULL,
    `contact_address` LONGTEXT NULL,
    `phone` VARCHAR(500) NULL,
    `email` VARCHAR(500) NULL,
    `invoice_address` LONGTEXT NULL,
    `tax_id` VARCHAR(500) NULL,
    `price` INTEGER NULL,
    `reject_comment` LONGTEXT NULL,
    `confirmed_date` DATETIME(3) NULL,
    `status_id` INTEGER NOT NULL DEFAULT 1,
    `is_active` INTEGER NOT NULL DEFAULT 1,
    `is_publish` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_booking_method` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipment_booking_id` INTEGER NOT NULL,
    `equipment_method_id` INTEGER NOT NULL,
    `quantity` INTEGER NULL,
    `price` INTEGER NULL,
    `is_active` INTEGER NOT NULL DEFAULT 1,
    `is_publish` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `equipment_booking` ADD CONSTRAINT `equipment_booking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_booking` ADD CONSTRAINT `equipment_booking_equipment_id_fkey` FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_booking_method` ADD CONSTRAINT `equipment_booking_method_equipment_booking_id_fkey` FOREIGN KEY (`equipment_booking_id`) REFERENCES `equipment_booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_booking_method` ADD CONSTRAINT `equipment_booking_method_equipment_method_id_fkey` FOREIGN KEY (`equipment_method_id`) REFERENCES `equipment_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
