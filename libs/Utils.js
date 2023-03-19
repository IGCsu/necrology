import { GuildMember } from 'discord.js';

export class Utils {

	/**
	 * Формирует имя участника гильдии
	 *
	 * @param {GuildMember} member
	 * @param {boolean} [discriminator=false] Если true - добавляет к нику дискриминатор
	 * @param {boolean} [id=false] Если true - добавляет к результату ID
	 * @return {string} Имя участника
	 */
	static member2name (member, discriminator, id) {
		let str = member.displayName ?? member.nickname ?? member.user.username;

		if (discriminator) {
			str += '#' + member.user.discriminator;
		}

		if (id) {
			if (member.user.bot) {
				str = 'bot:' + str;
			}
			str = member.user.id + ':' + str;
		}

		return str;
	}

}