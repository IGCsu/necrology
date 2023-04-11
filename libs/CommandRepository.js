import { Logger } from './Logger.js';
import { HelpController } from '../mvc/controllers/HelpController.js';
import { Command } from './Command.js';

export class CommandRepository {

	/**
	 * Список команд бота
	 * @type {Object.<string, Command>}
	 */
	static list = {
		help: Command.create('help', HelpController.command)
			.addDesc('en', 'Bot Information')
			.addDesc('ru', 'Информация о боте')
	};

	/**
	 * Возвращает команду
	 * @param {string} name
	 * @return {Command}
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
	 * Перебор команд с вызовом функции
	 * Если функция вернёт false - перебор будет прерван
	 * @param {(Command) => boolean} callback
	 */
	static each (callback) {
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