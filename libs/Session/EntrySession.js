import { Session } from './Session.js';
import { Config } from '../../mvc/models/Config.js';
import { Lang } from '../../mvc/models/Lang.js';
import {
	CategoryChannel,
	ForumChannel,
	GuildAuditLogsEntry,
	GuildMember,
	Message,
	NewsChannel,
	StageChannel,
	TextChannel,
	ThreadChannel,
	VoiceChannel
} from 'discord.js';
import { Logger } from '../Logger.js';

export class EntrySession extends Session {

	/**
	 * @type GuildAuditLogsEntry
	 */
	entry;

	/**
	 * Предыдущее значение таймаута
	 * @type {Date}
	 */
	oldTimeout;

	/**
	 * Новое значение таймаута
	 * @type {Date}
	 */
	newTimeout;

	/**
	 * Разница во времени в строковом формате
	 * @type {string}
	 */
	diffTime;

	/**
	 * Канал для логов
	 * @type {CategoryChannel|NewsChannel|StageChannel|TextChannel|VoiceChannel|ForumChannel}
	 */
	channel;

	/** @type {GuildMember} */
	targetMember;

	/** @type {GuildMember} */
	executorMember;

	/** @type {Message} */
	message;

	/** @type {ThreadChannel} */
	thread;

	/**
	 * @param {GuildAuditLogsEntry} entry
	 * @param {Guild} guild
	 * @param {Config} [config]
	 * @param {Lang} [lang]
	 * @param {Logger} [logger]
	 */
	constructor (entry, guild, config, lang, logger) {
		super(guild, config, lang, logger);

		this.entry = entry;
	}

	/**
	 * @param {GuildAuditLogsEntry} entry
	 * @param {Guild} guild
	 */
	static init (entry, guild) {
		return new this(entry, guild);
	}

	/**
	 * Получает необходимые данные из API.
	 * Возвращает false, если данные не найдены.
	 * @return {boolean}
	 */
	async fetchData () {
		this.channel = await this.guild.channels.fetch(this.config.channelId);
		if (!this.channel) {
			this.logger.info('Channel not found, skip');
			return false;
		}

		this.targetMember = await this.guild.members.fetch(this.entry.targetId);
		if (!this.targetMember) {
			this.logger.info('Target member not found, skip');
			return false;
		}

		this.executorMember = await this.guild.members.fetch(this.entry.executorId);
		if (!this.executorMember) {
			this.logger.info('Executor member not found, skip');
			return false;
		}

		return true;
	}

}