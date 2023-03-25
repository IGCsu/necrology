import { Session } from './Session.js';
import { Config } from '../../mvc/models/Config.js';
import { Lang } from '../../mvc/models/Lang.js';
import { Logger } from '../Logger.js';
import { ChatInputCommandInteraction } from 'discord.js';

export class InteractionSession extends Session {

	/**
	 * Interaction
	 * @type {ChatInputCommandInteraction}
	 */
	int;

	/**
	 * @param {ChatInputCommandInteraction} int
	 * @param {Guild} guild
	 * @param {Config} [config]
	 * @param {Lang} [lang]
	 * @param {Logger} [logger]
	 */
	constructor (int, guild, config, lang, logger) {
		super(guild, config, lang, logger);

		this.int = int;
	}

	/**
	 * @param {ChatInputCommandInteraction} int
	 */
	static init (int) {
		const config = Config.getOrCreate(int.guildId);
		const lang = Lang.get(config.lang, int.locale);

		return new this(int, int.guild, config, lang);
	}

}