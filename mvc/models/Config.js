import { DB } from '../../libs/DB.js';
import { Lang } from './Lang.js';

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
	lang = Lang.DEFAULT_LANG;

	/**
	 * ID канала Дискорда для вывода результата
	 * @type {string}
	 */
	channelId;

	/**
	 * Показывает сохранена ли модель в БД
	 * @type {boolean}
	 */
	saved = true;

	/**
	 * @param {Object} data
	 */
	constructor (data) {
		if (data.guildId) this.guildId = data.guildId;
		if (data.lang) this.lang = data.lang;
		if (data.channelId) this.channelId = data.channelId;

		if (data.saved) this.saved = data.saved;
	}

	/**
	 * Возвращает модель конфигурацию сообщества
	 * @param guildId ID сообщества Дискорда
	 * @return {Config}
	 */
	static get (guildId) {
		if (this.configs[guildId]) {
			return this.configs[guildId];
		}

		const config = DB.query('SELECT * FROM ' + this.TABLE_NAME + ' WHERE guildId = ? LIMIT 1', [guildId]);

		return config[0] ? new this(config[0]) : undefined;
	}

	/**
	 * Создаёт модель конфигурации сообщества
	 * @param {string} data.guildId
	 * @param {string} [data.lang]
	 * @param {string} [data.channelId]
	 * @param {boolean} [data.saved]
	 * @return {Config}
	 */
	static create (data) {
		const defaultData = {
			guildId: data.guildId
		};

		for (const key in defaultData) {
			if (!data[key]) data[key] = defaultData[key];
		}

		data.saved = false;

		return this.configs[data.guildId] = new this(data);
	}

	/**
	 * Возвращает или создаёт модель конфигурации сообщества
	 * @param guildId ID сообщества Дискорда
	 * @return {Config}
	 */
	static getOrCreate (guildId) {
		if (this.configs[guildId]) {
			return this.configs[guildId];
		}

		const config = DB.query('SELECT * FROM ' + this.TABLE_NAME + ' WHERE guildId = ? LIMIT 1', [guildId]);

		return this.configs[guildId] = config[0]
			? new this(config[0])
			: this.create({ guildId: guildId });
	}

	/**
	 * Возвращает наличие конфигурации сообщества
	 * @param guildId ID сообщества Дискорда
	 * @return {boolean}
	 */
	static has (guildId) {
		return !!this.get(guildId);
	}

}