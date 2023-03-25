import { GuildAuditLogsEntry } from 'discord.js';

export class NecrologyController {

	/**
	 * Обработка изменение таймаута участника
	 * @param {EntrySession} s
	 */
	static async guildMemberUpdate (s) {

		for (const change of s.entry.changes) {
			if (change.key === 'communication_disabled_until') {
				if (change.old) s.oldTimeout = new Date(String(change.old));
				if (change.new) s.newTimeout = new Date(String(change.new));
				break;
			}
		}

		// Получили ивент, который не связан с мутом
		if (!s.newTimeout && !s.oldTimeout) {
			return;
		}

		if (!await s.fetchData()) {
			return;
		}

		// Получили ивент на мут
		if (s.newTimeout) {
			return await this.mute(s);
		}

		// Получили ивент на размут
		if (s.oldTimeout) {
			return await this.unmute(s);
		}

	}

	/**
	 * Обработка действия мута
	 * @param {EntrySession} s
	 */
	static async mute (s) {
		const now = new Date();
		s.diffTime = this.getTimeDiff(s.newTimeout, now);

		// const threadName = now.toJSON() + ' ' + s.diffTime + ' ' + Utils.member2name(s.targetMember, true, true);
		//
		// const msg = await s.channel.send(NecrologyView.mute(s));
		// const thread = await msg.startThread({ name: threadName });
		//
		// this.cache[after.id] = {
		// 	until: after.communicationDisabledUntilTimestamp,
		// 	messageId: msg.id
		// };
	}

	/**
	 *
	 * @param {GuildAuditLogsEntry} entry
	 */
	static async unmute (entry) {

	}

	/**
	 *
	 * @param {GuildAuditLogsEntry} entry
	 */
	static async guildBanAdd (entry) {

	}

	/**
	 * Возвращает время мута
	 * @param {Date} timestamp
	 * @param {Date} [now]
	 * @returns {string}
	 */
	static getTimeDiff (timestamp, now) {
		if (!now) now = new Date();

		const difference = Math.floor((timestamp.getTime() - now.getTime()) / 1000);

		const minutes = Math.floor((difference / 60) % 60);
		const hours = Math.floor((difference / 3600) % 24);
		const days = Math.floor(difference / 86400);

		let text = '';

		if (days > 0) text += days + 'd ';
		if (hours > 0) text += hours + 'h ';
		if (minutes > 0) text += minutes + 'm ';

		return difference >= 60 ? text : difference + 's';
	}

}