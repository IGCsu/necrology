import { Action } from '../models/Action.js';
import { Utils } from '../../libs/Utils.js';
import { NecrologyView } from '../view/NecrologyView.js';

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
		s.diffTime = this.getTimeDiff(s.newTimeout, s.timestamp);

		const threadName = s.timestamp.toJSON() + ' ' + s.diffTime + ' ' + Utils.member2name(s.targetMember, true, true);

		s.message = await s.channel.send(NecrologyView.mute(s));
		s.thread = await s.message.startThread({ name: threadName });

		Action.createFromEntrySession(Action.TYPE_MUTE, s);
	}

	/**
	 *
	 * @param {EntrySession} s
	 */
	static async unmute (s) {
		const action = Action.getLastByUser(s.entry.targetId, s.guild.id, Action.TYPE_MUTE);

		s.diffTime = this.getTimeDiff(s.oldTimeout, action.timestamp);

		if (!action) {
			s.logger.warn('Not found mute action', [s.entry.targetId, s.guild.id]);
			return;
		}

		s.message = await s.channel.messages.fetch(action.messageId);

		if (!s.message) {
			s.logger.warn('Mute message not found', action);
			return;
		}

		await s.message.edit(NecrologyView.unmute(s, action));

		Action.createFromEntrySession(Action.TYPE_UNMUTE, s, action);
	}

	/**
	 *
	 * @param {EntrySession} s
	 */
	static async guildBanAdd (s) {
		if (!await s.fetchData()) {
			return;
		}

		const threadName = s.timestamp.toJSON() + ' BAN ' + Utils.member2name(s.targetMember, true, true);

		s.message = await s.channel.send(NecrologyView.ban(s));
		s.thread = await s.message.startThread({ name: threadName });

		Action.createFromEntrySession(Action.TYPE_BAN, s);
	}

	/**
	 * Возвращает время мута
	 * @param {Date|number} timestamp
	 * @param {Date|number} [now]
	 * @returns {string}
	 */
	static getTimeDiff (timestamp, now) {
		if (!now) {
			now = new Date();
		}

		const difference = Math.round((timestamp - now) / 1000);

		const seconds = Math.round(difference % 60);
		const minutes = Math.round((difference / 60) % 60);
		const hours = Math.round((difference / 3600) % 24);
		const days = Math.round(difference / 86400);

		let text = '';

		if (days > 0) text += days + 'd ';
		if (hours > 0) text += hours + 'h ';
		if (minutes > 0) text += minutes + 'm ';
		if (seconds > 0) text += seconds + 's ';

		return text;
	}

}