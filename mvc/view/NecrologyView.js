import { EmbedBuilder } from 'discord.js';
import { Action } from '../models/Action.js';
import { Utils } from '../../libs/Utils.js';

export class NecrologyView {

	static COLOR_WARN = 0;
	static COLOR_MUTE = 2075752;
	static COLOR_UNMUTE = 5131854;
	static COLOR_BAN = 3;
	static COLOR_UNBAN = 4;
	static COLOR_KICK = 4;

	static colors = [
		this.COLOR_WARN,
		this.COLOR_MUTE,
		this.COLOR_UNMUTE,
		this.COLOR_BAN,
		this.COLOR_UNBAN,
		this.COLOR_KICK
	];

	/**
	 *
	 * @param {EntrySession} s
	 * @return {{embeds: EmbedBuilder[]}}
	 */
	static mute (s) {
		return {
			embeds: [
				this.getPrimaryEmbed(
					s,
					Action.TYPE_MUTE,
					s.timestamp,
					s.newTimeout,
					s.entry?.reason
				)
			]
		};
	}

	/**
	 * @param {EntrySession} s
	 * @param {Action} parentAction
	 * @return {{embeds: EmbedBuilder[]}}
	 */
	static unmute (s, parentAction) {
		return {
			embeds: [
				this.getPrimaryEmbed(
					s,
					Action.TYPE_UNMUTE,
					parentAction.timestamp,
					s.timestamp,
					parentAction.reason
				),
				this.getSecondaryEmbed(s, Action.TYPE_UNMUTE)
			]
		};
	}

	/**
	 * @param {EntrySession} s
	 * @return {{embeds: EmbedBuilder[]}}
	 */
	static ban (s) {
		return {
			embeds: [
				this.getPrimaryEmbed(s, Action.TYPE_BAN, s.entry?.reason)
			]
		};
	}

	/**
	 *
	 * @param {EntrySession} s
	 * @param {number} type
	 * @param {number} startTimestamp
	 * @param {number} endTimestamp
	 * @param {string} [reason]
	 * @return {EmbedBuilder}
	 */
	static getPrimaryEmbed (s, type, startTimestamp, endTimestamp, reason) {
		let title;
		let description;

		if (type === Action.TYPE_UNMUTE || type === Action.TYPE_MUTE) {
			title = s.lang.str('Timeout for') + ' ' + s.diffTime;
		}

		if (type === Action.TYPE_UNBAN || type === Action.TYPE_BAN) {
			title = s.lang.str('Ban');
		}

		if (type === Action.TYPE_UNBAN || type === Action.TYPE_UNMUTE) {
			title += '(' + s.lang.str('canceled') + ')';
		}

		description = s.lang.str('Target member') +
			': <@' + s.targetMember.id + '>\n';
		description += s.lang.str('Executor member') +
			': <@' + s.executorMember.id + '>\n';

		if (type === Action.TYPE_UNMUTE || type === Action.TYPE_MUTE) {
			description += s.lang.str('Timeout ends') +
				' <t:' + Math.floor(endTimestamp / 1000) + ':R>\n';
		}

		description += s.lang.str('Reason') + ': ' +
			(reason ?? s.lang.str('no reason'));

		return new EmbedBuilder()
			.setTitle(title)
			.setColor(this.colors[type])
			.setTimestamp(startTimestamp)
			.setDescription(description)
			.setThumbnail(s.targetMember.displayAvatarURL())
			.setFooter({
				iconURL: s.executorMember.displayAvatarURL(),
				text: Utils.member2name(s.executorMember, true)
			});
	}

	/**
	 * @param {EntrySession} s
	 * @param {number} type
	 * @return {EmbedBuilder}
	 */
	static getSecondaryEmbed (s, type) {
		let description;

		switch (type) {
			case Action.TYPE_UNMUTE:
				description = s.lang.str('Timeout');
				break;
			case Action.TYPE_UNBAN:
				description = s.lang.str('Ban');
				break;
		}

		description += ' ' + s.lang.str('canceled') + '\n';
		description += s.lang.str('Executor member') +
			': <@' + s.executorMember.id + '>\n';

		return new EmbedBuilder()
			.setColor(this.colors[type])
			.setTimestamp()
			.setDescription(description)
			.setFooter({
				iconURL: s.executorMember.displayAvatarURL(),
				text: Utils.member2name(s.executorMember, true)
			});
	}

}