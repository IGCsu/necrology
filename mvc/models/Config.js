import { Lang } from './Lang.js';
import { BaseModel } from './BaseModel.js';

/**
 * Конфигурация бота для сообщества
 */
export class Config extends BaseModel {

	static TABLE_NAME = 'configs';
	static PRIMARY_KEY = 'guildId';
	static FIELDS = {
		guildId: 'string',
		lang: 'string',
		channelId: 'string'
	};

	/**
	 * Кеш моделей
	 * @type {Object.<number, Config>}
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
	 * @param {Object} data
	 * @param {boolean} [saved=false] определяет, сохранена ли модель в БД
	 */
	constructor (data, saved) {
		super(data, saved);
		if (data.guildId) this.guildId = data.guildId;
		if (data.lang) this.lang = data.lang;
		if (data.channelId) this.channelId = data.channelId;
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

		const config = this.selectQuery({ guildId: guildId });

		return config ? this.configs[guildId] = new this(config, true) : undefined;
	}

	/**
	 * Создаёт модель конфигурации сообщества
	 * @param {string} data.guildId
	 * @param {string} [data.lang]
	 * @param {string} [data.channelId]
	 * @return {Config}
	 */
	static create (data) {
		const defaultData = {
			guildId: data.guildId
		};

		for (const key in defaultData) {
			if (!data[key]) data[key] = defaultData[key];
		}

		const config = new this(data);
		config.save();

		return this.configs[config.guildId] = config;
	}

	/**
	 * Возвращает или создаёт модель конфигурации сообщества
	 * @param guildId ID сообщества Дискорда
	 * @return {Config}
	 */
	static getOrCreate (guildId) {
		return this.get(guildId) ?? this.create({ guildId: guildId });
	}

}