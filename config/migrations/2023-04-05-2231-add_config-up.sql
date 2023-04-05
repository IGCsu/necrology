CREATE TABLE IF NOT EXISTS `configs` (
	`guildId` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`lang` VARCHAR(2) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`channelId` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`guildId`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
