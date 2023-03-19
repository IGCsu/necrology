import { GuildBan, GuildMember } from 'discord.js';

export class Necrology {

	/**
	 * Функция прослушки ивента обновления.
	 * Срабатывает лишь на те ивенты, когда пользователя мутят.
	 *
	 * @param {GuildMember} before Юзер до обновления
	 * @param {GuildMember} after  Юзер после обновления
	 */
	static async guildMemberUpdate (before, after) {
		if (before.communicationDisabledUntilTimestamp === after.communicationDisabledUntilTimestamp) {
			return;
		}

		const advancedMuteData = await this.getAdvancedTimeoutData(after.user);
		console.log(advancedMuteData);
	}

	/**
	 *
	 * @param {GuildBan} ban
	 */
	static async guildBanAdd (ban) {

	}

	/**
	 * Функция получения данных из Аудит лога.
	 *
	 * @param {User} target Цель поиска
	 * @return {Object<author: User, reason: string>}}
	 */
	static async getAdvancedTimeoutData (target) {
		const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 24 });
		let result = { author: undefined, reason: undefined };

		const entry = auditLogs.entries.first();
		if (!entry) return result;
		if (entry.changes[0].key === 'communication_disabled_until' &&
			entry.target === target) {
			result.author = entry.executor;
			result.reason = entry.reason;
		}

		return result;
	}

}