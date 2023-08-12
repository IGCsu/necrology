import { EmbedBuilder } from 'discord.js';
import { Action } from '../models/Action.ts';
import { Utils } from '../../libs/Utils.ts';

export class NecrologyView {

	static COLOR_WARN = 0;
	static COLOR_MUTE = Const.COLOR_GREEN;
	static COLOR_UNMUTE = Const.COLOR_GREY;
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
			title = s._('Timeout for') + ' ' + s.diffTime;
		}

		if (type === Action.TYPE_UNBAN || type === Action.TYPE_BAN) {
			title = s._('Ban');
		}

		if (type === Action.TYPE_UNBAN || type === Action.TYPE_UNMUTE) {
			title += '(' + s._('canceled') + ')';
		}

		description = s._('Target member') +
			': <@' + s.targetMember.id + '>\n';
		description += s._('Executor member') +
			': <@' + s.executorMember.id + '>\n';

		if (type === Action.TYPE_UNMUTE || type === Action.TYPE_MUTE) {
			description += s._('Timeout ends') +
				' <t:' + Math.floor(endTimestamp / 1000) + ':R>\n';
		}

		description += s._('Reason') + ': ' +
			(reason ?? s._('no reason'));

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
				description = s._('Timeout');
				break;
			case Action.TYPE_UNBAN:
				description = s._('Ban');
				break;
		}

		description += ' ' + s._('canceled') + '\n';
		description += s._('Executor member') +
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