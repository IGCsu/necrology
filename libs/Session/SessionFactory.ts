import { Session } from './Session';
import { CommandInteraction, Guild, GuildAuditLogsEntry } from 'discord.js';
import { RuntimeError } from '../Error/RuntimeError';
import { Config } from '../../mvc/models/Config';
import { InteractionSession } from './InteractionSession';
import { EntrySession } from './EntrySession';

export class SessionFactory {

	public static async initSession (guild: Guild): Promise<Session> {
		return new Session(guild, await Config.findOneByGuildIdOrCreate(guild.id));
	}

	public static async initInteractionSession (int: CommandInteraction): Promise<InteractionSession> {
		if (!int.guild) {
			throw new RuntimeError('Interaction incorrect');
		}

		return new InteractionSession(int, int.guild, await Config.findOneByGuildIdOrCreate(int.guild.id));
	}

	public static async initEntrySession (entry: GuildAuditLogsEntry, guild: Guild): Promise<EntrySession> {
		return new EntrySession(entry, guild, await Config.findOneByGuildIdOrCreate(guild.id));
	}

}