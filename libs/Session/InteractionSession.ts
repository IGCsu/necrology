import { Session } from './Session';
import { CommandInteraction, Guild } from 'discord.js';
import { Config } from '../../mvc/models/Config';

export class InteractionSession extends Session {

	public constructor (
		public readonly int: CommandInteraction,
		guild: Guild,
		config: Config
	) {
		super(guild, config);

		this.int = int;
	}

}