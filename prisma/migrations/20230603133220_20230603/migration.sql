-- DropForeignKey
ALTER TABLE `Chat` DROP FOREIGN KEY `Chat_user_id_fkey`;

-- AlterTable
ALTER TABLE `Chat` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `message` VARCHAR(300) NULL,
    MODIFY `user_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `src_url` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
