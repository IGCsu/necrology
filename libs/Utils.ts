import { GuildMember } from 'discord.js';

export class Utils {

	/** Формирует имя участника гильдии */
	public static member2name (
		member: GuildMember,
		needId: boolean = false
	): string {
		let str = member.displayName ?? member.nickname ?? member.user.username;

		if (needId) {
			if (member.user.bot) {
				str = 'bot:' + str;
			}
			str = member.user.id + ':' + str;
		}

		return str;
	}

}