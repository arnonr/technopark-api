/*
  Warnings:

  - Added the required column `member_status` to the `equipment_booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period_time` to the `equipment_booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `equipment_booking` ADD COLUMN `member_status` INTEGER NOT NULL,
    ADD COLUMN `period_time` INTEGER NOT NULL;
