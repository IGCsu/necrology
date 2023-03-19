import { DB } from '../../libs/DB.js';

/**
 * Конфигурация бота для сообщества
 */
export class Config {

	/**
	 * Наименование таблицы в БД
	 * @type {string}
	 */
	static TABLE_NAME = 'configs';

	/**
	 * Кеш моделей
	 * @type {Object.<string, Config>}
	 */
	static configs = {};

	/**
	 * ID сообщества Дискорда
	 * @type {string}
	 */
	id;

	/**
	 * Выбранная локализация
	 * @type {string}
	 */
	lang = 'ru';

	/**
	 * ID канала Дискорда для вывода результата
	 * @type {string}
	 */
	channelId;

	/**
	 * @param {string} data.id
	 * @param {string} data.lang
	 * @param {string} data.channelId
	 */
	constructor (data) {
		if (data.id) this.id = data.id;
		if (data.lang) this.lang = data.lang;
		if (data.channelId) this.channelId = data.channelId;
	}

	/**
	 * Возвращает конфигурацию сервера
	 * @param id ID сообщества Дискорда
	 * @return {Config}
	 */
	static get (id) {
		if (this.configs[id]) {
			return this.configs[id];
		}

		const config = DB.query('SELECT * FROM ' + this.TABLE_NAME + ' WHERE id = ? LIMIT 1', [id]);

		const data = config[0] ?? { id: id };

		return this.configs[id] = new this(data);
	}

}