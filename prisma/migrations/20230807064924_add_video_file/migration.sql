/*
  Warnings:

  - Added the required column `video_file` to the `video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `video` ADD COLUMN `video_file` VARCHAR(500) NOT NULL;
