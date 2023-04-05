ALTER TABLE `configs`
	ADD COLUMN `firstMessage` TINYINT(1) NULL DEFAULT '0' AFTER `channelId`;