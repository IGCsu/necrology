import { AuditLogEvent, Client, Events, Guild } from 'discord.js';
import { Logger } from './Logger.js';
import { Commands } from './Commands.js';
import { Necrology } from '../mvc/controllers/Necrology.js';
import { Config } from '../mvc/models/Config.js';
import { Lang } from '../mvc/models/Lang.js';

export class Router {

	/**
	 * Инициализирует слушателей
	 * @param {Client} client
	 */
	static init (client) {
		client.on(Events.ClientReady, () => this.ready(client));

		client.on(Events.InteractionCreate, async (int) => {
			const name = int.commandName ?? int.customId.split('|')[0];

			if (!Commands.has(name)) return;

			/**
			 * Логгер
			 * @type {Logger}
			 */
			int.logger = Logger.init(int.guildId);
			int.logger.info('Start "' + name + '" command');

			/**
			 * Конфигурация
			 * @type {Config}
			 */
			int.config = Config.getOrCreate(int.guildId);

			/**
			 * Локализация
			 * @type {Lang}
			 */
			int.lang = Lang.get(int.config.lang, int.locale);

			await Commands.get(name).func(int);
		});

		client.on(Events.GuildAuditLogEntryCreate, async (entry, guild) => {

			/**
			 * ID сообщества дискорда
			 * @type {Guild}
			 */
			entry.guild = guild;

			/**
			 * Логгер
			 * @type {Logger}
			 */
			entry.logger = Logger.init(entry.guild.id);

			if (Config.has(entry.guild.id)) {
				entry.logger.info('Guild not configured, ignore');
				return;
			}

			/**
			 * Конфигурация
			 * @type {Config}
			 */
			entry.config = Config.get(entry.guild.id);

			/**
			 * Локализация
			 * @type {Lang}
			 */
			entry.lang = Lang.get(entry.config.lang);

			switch (entry.action) {
				case AuditLogEvent.MemberUpdate:
					await Necrology.guildMemberUpdate(entry);
					break;
				case AuditLogEvent.MemberBanAdd:
					await Necrology.guildBanAdd(entry);
					break;
			}
		});

	}

	static ready (client) {
		Commands.init(client);
		Logger.info('Bot ready!');
	}

}