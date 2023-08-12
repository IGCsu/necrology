import { PermissionsBitField } from 'discord.js';
import { Command, CommandName } from './Command';
import { Logger } from './Logger';

export interface CommandMap {
	[key: CommandName]: Command;
}

export type CommandCallback = (c: Command) => boolean;

export class CommandRepository {

	protected static list: CommandMap = {

		help: Command.create('help', async (s) => {})
			.setDesc('Help title'),

		config: Command.create('config', async (s) => {})
			.setPerm(PermissionsBitField.Flags.ManageGuild)
			.setDesc('Config title')
		// .addOptions(ConfigController.getCommandOptions())

	};

	public static get (key: CommandName): Command {
		return this.list[key];
	}

	public static has (key: CommandName): boolean {
		return !!this.list[key];
	}

	/**
	 * Перебор команд с вызовом функции
	 * Если функция вернёт false - перебор будет прерван
	 */
	public static each (callback: CommandCallback) {
		for (const name in this.list) {
			if (callback(this.get(name)) === false) {
				break;
			}
		}
	}

	/**
	 * Регистрирует команды
	 * @param {Client} client
	 */
	static init (client) {
		for (const name in this.list) {
			client.application.commands
				.create(this.get(name).toDiscord())
				.then(command => {
					this.get(name).setApp(command);
					Logger.info('Command "' + name + '" registered');
				});
		}
	}

}