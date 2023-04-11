import { AuditLogEvent, Client, Events } from 'discord.js';
import { Logger } from './Logger.js';
import { CommandRepository } from './CommandRepository.js';
import { NecrologyController } from '../mvc/controllers/NecrologyController.js';
import { InteractionSession } from './Session/InteractionSession.js';
import { EntrySession } from './Session/EntrySession.js';

export class Router {

	/**
	 * Инициализирует слушателей
	 * @param {Client} client
	 */
	static init (client) {
		client.on(Events.ClientReady, () => this.ready(client));

		client.on(Events.InteractionCreate, async (int) => {
			const name = int.commandName ?? int.customId.split('|')[0];

			if (!CommandRepository.has(name)) return;

			const s = InteractionSession.init(int);

			s.logger.info('Start "' + name + '" command');

			/** @see CommandRepository.list */
			await CommandRepository.get(name).func(s);
		});

		client.on(Events.GuildAuditLogEntryCreate, async (entry, guild) => {

			const s = EntrySession.init(entry, guild);

			if (!s.config.channelId) {
				s.logger.info('Channel ID not specified, skip');
				return;
			}

			switch (s.entry.action) {
				case AuditLogEvent.MemberUpdate:
					await NecrologyController.guildMemberUpdate(s);
					break;
				case AuditLogEvent.MemberBanAdd:
					await NecrologyController.guildBanAdd(s);
					break;
			}
		});

	}

	static ready (client) {
		CommandRepository.init(client);
		Logger.info('Bot ready!');
	}

}