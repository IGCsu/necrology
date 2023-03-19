import { GuildAuditLogsEntry } from 'discord.js';

export class Necrology {

	/**
	 * Обработка изменение таймаута участника
	 * @param {GuildAuditLogsEntry} entry
	 */
	static async guildMemberUpdate (entry) {

		/**
		 * Предыдущее значение таймаута
		 * @type {Date}
		 */
		entry.oldTimeout = undefined;

		/**
		 * Новое значение таймаута
		 * @type {Date}
		 */
		entry.newTimeout = undefined;

		for (const change of entry.changes) {
			if (change.key === 'communication_disabled_until') {
				entry.oldTimeout = new Date(String(change.old));
				entry.newTimeout = new Date(String(change.new));
				break;
			}
		}

		// Получили ивент на мут
		if (entry.newTimeout) {
			return await this.mute(entry);
		}

		// Получили ивент на размут
		if (entry.oldTimeout) {
			return await this.unmute(entry);
		}

	}

	/**
	 *
	 * @param {GuildAuditLogsEntry} entry
	 */
	static async mute (entry) {
		// const time = this.getTimeMute(after.communicationDisabledUntilTimestamp);
		// const date = new Date().toISO();
		// const text = date + ' ' + time + ' ' + after.toName() + ' ' + after.user.id;
		//
		// const channel = (advancedMuteData?.reason &&
		// 	/\((test|тест)\)/.test(advancedMuteData.reason))
		// 	? 'debugChannel'
		// 	: 'channel';
		//
		// const msg = await this[channel].send({ embeds: [embed] });
		// const thread = await msg.startThread({ name: text });
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

}