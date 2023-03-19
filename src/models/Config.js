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
	guildId;

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
	 * @param {string} data.guildId
	 * @param {string} data.lang
	 * @param {string} data.channelId
	 */
	constructor (data) {
		if (data.guildId) this.guildId = data.guildId;
		if (data.lang) this.lang = data.lang;
		if (data.channelId) this.channelId = data.channelId;
	}

	/**
	 * Возвращает конфигурацию сервера
	 * @param guildId ID сообщества Дискорда
	 * @return {Config}
	 */
	static get (guildId) {
		if (this.configs[guildId]) {
			return this.configs[guildId];
		}

		const config = DB.query('SELECT * FROM ' + this.TABLE_NAME + ' WHERE guildId = ? LIMIT 1', [guildId]);

		const data = config[0] ?? { guildId: guildId };

		return this.configs[guildId] = new this(data);
	}

}