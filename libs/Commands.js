import { Logger } from './Logger.js';
import { HelpController } from '../mvc/controllers/HelpController.js';

export class Commands {

	/**
	 * Список команд бота
	 * @type {Object.<string, Object>}
	 */
	static list = {

		help: {
			func: HelpController.helpCommand,
			name: 'help',
			description: 'Bot Information',
			descriptionLocalizations: {
				'en-US': 'Bot Information',
				'en-GB': 'Bot Information',
				'ru': 'Информация о боте'
			}
		}

	};

	/**
	 * Возвращает команду
	 * @param {string} name
	 * @return {Object}
	 */
	static get (name) {
		return this.list[name];
	}

	/**
	 * Проверяет существование команды по наименованию
	 * @param {string} name
	 * @return {boolean}
	 */
	static has (name) {
		return !!this.list[name];
	}

	/**
	 * Регистрирует команды
	 * @param {Client} client
	 */
	static init (client) {
		for (const name in this.list) {
			client.application.commands.create(this.get(name), '921532106914537502')
				.then(() => Logger.info('Command "' + name + '" registered'));
		}
	}

}