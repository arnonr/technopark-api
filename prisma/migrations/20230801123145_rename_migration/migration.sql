-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_news_type_id_fkey` FOREIGN KEY (`news_type_id`) REFERENCES `news_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
