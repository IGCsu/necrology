import { GuildAuditLogsEntry, Guild } from 'discord.js';
import { Utils } from '../../libs/Utils.js';

export class Necrology {

	/**
	 * Обработка изменение таймаута участника
	 * @param {Object} session
	 * @param {GuildAuditLogsEntry} session.entry
	 * @param {Guild} session.guild
	 * @param {Logger} session.logger
	 * @param {Config} session.config
	 * @param {Lang} session.lang
	 */
	static async guildMemberUpdate (session) {

		/**
		 * Предыдущее значение таймаута
		 * @type {Date}
		 */
		session.oldTimeout = undefined;

		/**
		 * Новое значение таймаута
		 * @type {Date}
		 */
		session.newTimeout = undefined;

		for (const change of session.entry.changes) {
			if (change.key === 'communication_disabled_until') {
				session.oldTimeout = new Date(String(change.old));
				session.newTimeout = new Date(String(change.new));
				break;
			}
		}

		// Получили ивент на мут
		if (session.newTimeout) {
			return await this.mute(session);
		}

		// Получили ивент на размут
		if (session.oldTimeout) {
			return await this.unmute(session);
		}

	}

	/**
	 * Обработка действия мута
	 * @param {Object} session
	 * @param {GuildAuditLogsEntry} session.entry
	 * @param {Guild} session.guild
	 * @param {Logger} session.logger
	 * @param {Config} session.config
	 * @param {Lang} session.lang
	 * @param {Date} [session.newTimeout]
	 * @param {Date} [session.oldTimeout]
	 */
	static async mute (session) {
		await this.fetchData(session);

		const now = new Date();
		const time = this.getTimeDiff(session.newTimeout, now);

		const threadName = now.toJSON() + ' ' + time + ' ' + Utils.member2name(session.targetMember, true, true);

		console.log(threadName);

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

	/**
	 * Получает необходимые данные из API
	 * @param {Object} session
	 * @param {GuildAuditLogsEntry} session.entry
	 * @param {Guild} session.guild
	 * @param {Logger} session.logger
	 * @param {Config} session.config
	 * @return {Object} session
	 */
	static async fetchData (session) {
		session.channel = await session.guild.channels.fetch(session.config.channelId);
		if (!session.channel) {
			session.logger.info('Channel not found, skip');
			return;
		}

		session.targetMember = await session.guild.members.fetch(session.entry.targetId);
		if (!session.targetMember) {
			session.logger.info('Target member not found, skip');
			return;
		}

		session.executorMember = await session.guild.members.fetch(session.entry.executorId);
		if (!session.executorMember) {
			session.logger.info('Executor member not found, skip');
			return;
		}

		return session;
	}

}