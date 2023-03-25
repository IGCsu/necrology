import { Guild } from 'discord.js';
import { Logger } from '../Logger.js';
import { Config } from '../../mvc/models/Config.js';
import { Lang } from '../../mvc/models/Lang.js';

export class Session {

	/**
	 * Активная гильдия
	 * @type Guild
	 */
	guild;

	/**
	 * Текущая локализация
	 * @type Lang
	 */
	lang;

	/**
	 * Конфигурация сообщества
	 * @type Config
	 */
	config;

	/**
	 * Логгер
	 * @type Logger
	 */
	logger;

	/**
	 * Текущая временная метка
	 * @type {Date}
	 */
	timestamp;

	/**
	 * @param {Guild} guild
	 * @param {Config} [config]
	 * @param {Lang} [lang]
	 * @param {Logger} [logger]
	 */
	constructor (guild, config, lang, logger) {
		this.timestamp = new Date();

		this.guild = guild;
		this.config = config ?? Config.getOrCreate(guild.id);
		this.lang = lang ?? Lang.get(this.config.lang);
		this.logger = logger ?? Logger.init(guild.id);
	}

	/**
	 * @param {Object} data
	 * @param {Guild} data.guild
	 * @param {Config} [data.config]
	 * @param {Lang} [data.lang]
	 * @param {Logger} [data.logger]
	 */
	static init (data) {
		return new this(
			data.guild,
			data.config,
			data.lang,
			data.logger
		);
	}

}