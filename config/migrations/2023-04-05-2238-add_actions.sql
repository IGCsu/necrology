CREATE TABLE IF NOT EXISTS `actions` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`type` INT(1) NULL DEFAULT '0',
	`guildId` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`targetId` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`executorId` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`messageId` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`threadId` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`reason` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`parentId` BIGINT(20) NULL DEFAULT NULL,
	`timestamp` BIGINT(20) NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `type` (`type`) USING BTREE,
	INDEX `guildId` (`guildId`) USING BTREE,
	INDEX `targetId` (`targetId`) USING BTREE,
	INDEX `executorId` (`executorId`) USING BTREE,
	INDEX `messageId` (`messageId`) USING BTREE,
	INDEX `threadId` (`threadId`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=724
;
