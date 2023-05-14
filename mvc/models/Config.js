import { Lang } from './Lang.js';
import { BaseModel } from './BaseModel.js';
import { ConfigElement } from '../../libs/ConfigElement.js';

/**
 * Конфигурация бота для сообщества
 */
export class Config extends BaseModel {

	static TABLE_NAME = 'configs';
	static PRIMARY_KEY = 'guildId';
	static FIELDS = {
		guildId: 'string',
		lang: 'string',
		channelId: 'string',
		data: 'object'
	};

	/**
	 * Список настроек бота
	 * @type {Object.<string, ConfigElement>}
	 */
	static elements = {

		lang: ConfigElement.create('lang')
			.setDesc('Config lang desc')
			.setName('Config lang name'),

		channelId: ConfigElement.create('channelId')
			.setDesc('Config channelId desc')
			.setName('Config channelId name')

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
	 * Данные конфига
	 * @type {Object}
	 */
	data = {};

	/**
	 * @param {Object} data
	 * @param {boolean} [saved=false] определяет, сохранена ли модель в БД
	 */
	constructor (data, saved) {
		super(data, saved);
		if (data.guildId) this.guildId = data.guildId;
		if (data.lang) this.lang = data.lang;
		if (data.channelId) this.channelId = data.channelId;
		if (data.data) this.data = data.data;

		if (typeof this.data != 'object') this.data = JSON.parse(this.data);
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
	 * @param {string} [data.data]
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

	/**
	 * Возвращает элемент конфигурации
	 * @param {string} key
	 * @return {ConfigElement}
	 */
	static getElement (key) {
		return this.elements[key];
	}

}