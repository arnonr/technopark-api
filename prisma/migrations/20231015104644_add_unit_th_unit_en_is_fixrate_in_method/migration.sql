/*
  Warnings:

  - You are about to drop the column `unit` on the `equipment_method` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `equipment_method` DROP COLUMN `unit`,
    ADD COLUMN `is_fixrate` INTEGER NULL,
    ADD COLUMN `unit_en` VARCHAR(500) NULL,
    ADD COLUMN `unit_th` VARCHAR(500) NULL;
