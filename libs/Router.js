import { AuditLogEvent, Client, Events } from 'discord.js';
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

			const logger = Logger.init(int.guildId);
			const config = Config.getOrCreate(int.guildId);
			const lang = Lang.get(session.config.lang, int.locale);

			logger.info('Start "' + name + '" command');

			await Commands.get(name).func({
				int: int,
				logger: logger,
				config: config,
				lang: lang
			});
		});

		client.on(Events.GuildAuditLogEntryCreate, async (entry, guild) => {

			const logger = Logger.init(guild.id);

			// if (!Config.has(guild.id)) {
			// 	logger.info('Guild not configured, skip');
			// 	return;
			// }

			const config = Config.getOrCreate(guild.id);

			config.channelId = '924352019236552744';

			if (!config.channelId) {
				logger.info('Channel ID not specified, skip');
				return;
			}

			const lang = Lang.get(config.lang);

			let session = {
				entry: entry,
				guild: guild,
				logger: logger,
				config: config,
				lang: lang
			};

			switch (entry.action) {
				case AuditLogEvent.MemberUpdate:
					await Necrology.guildMemberUpdate(session);
					break;
				case AuditLogEvent.MemberBanAdd:
					await Necrology.guildBanAdd(session);
					break;
			}
		});

	}

	static ready (client) {
		Commands.init(client);
		Logger.info('Bot ready!');
	}

}