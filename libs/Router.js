import { Client } from 'discord.js';
import { Logger } from './Logger.js';
import { Commands } from './Commands.js';
import { Necrology } from '../src/controllers/Necrology.js';

export class Router {

	/**
	 * Инициализирует слушателей
	 * @param {Client} client
	 */
	static init (client) {
		client.on('ready', () => this.ready(client));

		client.on('interactionCreate', async (int) => {
			const name = int.commandName ?? int.customId.split('|')[0];

			if (!Commands.has(name)) return;

			int.logger = Logger.init(int.guildId);
			int.logger.info('Start "' + name + '" command');

			await Commands.get(name).func(int);
		});

		client.on('guildMemberUpdate', async (before, after) => {
			await Necrology.guildMemberUpdate(before, after);
		});

		client.on('guildBanAdd', async (ban) => {
			await Necrology.guildBanAdd(ban);
		});

	}

	static ready (client) {
		Commands.init(client);
		Logger.info('Bot ready!');
	}

}