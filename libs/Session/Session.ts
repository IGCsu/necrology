import { Guild } from 'discord.js';
import { Logger } from '../Logger.js';
import { Lang, LangKey, LangText } from '../Lang';
import { Config } from '../../mvc/models/Config';

export class Session {

	public readonly lang: Lang;
	public readonly logger: Logger;
	public readonly timestamp: Date;

	public constructor (
		public readonly guild: Guild,
		public readonly config: Config
	) {
		this.timestamp = new Date();

		this.guild = guild;
		this.config = config;

		this.lang = Lang.get(config.getLang().getValue());
		this.logger = Logger.initForGuild(guild.id);
	}

	/**
	 * Возвращает локализованный текст
	 * Алиас для {@see Lang.str}
	 */
	public _ (key: LangKey): LangText {
		return this.lang.str(key);
	}

}