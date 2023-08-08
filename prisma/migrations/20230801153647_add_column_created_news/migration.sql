/*
  Warnings:

  - Added the required column `created_news` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `news` ADD COLUMN `created_news` DATE NOT NULL;
