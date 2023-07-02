import { Logger } from '../Logger.js';

export class BaseScript {

	/**
	 * Наименование скрипта
	 */
	static SCRIPT_NAME;

	/**
	 * Аргументы скрипта
	 * @type {string[]}
	 */
	static args = [];

	/**
	 * Функция запуска скрипта
	 */
	static execute () {
		this.args = process.argv.splice(3);

		Logger.info('Start ' + this.SCRIPT_NAME, this.args);
	}

}