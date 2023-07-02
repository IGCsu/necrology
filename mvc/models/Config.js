import { Lang } from './Lang.js';
import { BaseModel } from './BaseModel.js';
import { ConfigElement } from '../../libs/ConfigElement.js';
import { InvalidArgumentError } from '../../libs/Error/InvalidArgumentError.js';
import { ApplicationCommandOptionType } from 'discord.js';

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
			.setName('Config lang name')
			.setValidateValueFunc({
				'The selected language is not supported': v => Lang.list[v]
			}),

		channelId: ConfigElement.create('channelId')
			.setDesc('Config channelId desc')
			.setName('Config channelId name')
			.setType(ApplicationCommandOptionType.Channel),

		enabledThread: ConfigElement.create('enabledThread')
			.setDesc('Config enabledThread desc')
			.setName('Config enabledThread name')
			.setType(ApplicationCommandOptionType.Boolean)
			.setDeepData(true)

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
		if (!this.elements[key]) {
			throw new InvalidArgumentError('Config key not found');
		}

		return this.elements[key];
	}

	/**
	 * Переводит значение в необходимый примитивный тип
	 * @param {number} type
	 * @param {*} value
	 * @return {number|string|boolean}
	 */
	static prepareValue (type, value) {
		switch (type) {
			case ApplicationCommandOptionType.Integer:
			case ApplicationCommandOptionType.Number:
				return Number(value);

			case ApplicationCommandOptionType.Boolean:
				return value === '1' || value === 'true' || value === true;

			case ApplicationCommandOptionType.String:
			default:
				return String(value);
		}
	}

	/**
	 * Возвращает значение конфигурации
	 * @param {string} key
	 * @return {number|string|boolean}
	 */
	get (key) {
		const element = Config.getElement(key);
		const value = element.deepData
			? this.data[key]
			: this[key];

		return Config.prepareValue(element.type, value);
	}

	/**
	 * Устанавливает значение конфигурации
	 * @param {string} key
	 * @param {string} value
	 */
	set (key, value) {
		if (Config.getElement(key).deepData) {
			this.data[key] = value;
		} else {
			this[key] = value;
		}

		this.save();
	}

}