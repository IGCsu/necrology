import { EmbedBuilder } from 'discord.js';

export class NecrologyView {

	/**
	 *
	 * @param {EntrySession} s
	 * @param {boolean} [isUnmute=false]
	 * @return {{embed: EmbedBuilder[]}}
	 */
	static mute (s, isUnmute) {
		let embed = new EmbedBuilder()
			.setTitle('Выдан мут ' + s.time)
			.setColor(2075752)
			.setTimestamp()
			.setDescription(isUnmute ? 'mute' : 'unmute');

		// TODO: Допилить мессадж мута и анмута

		return {
			embed: [embed]
		};
	}

	/**
	 *
	 * @param {EntrySession} s
	 * @return {{embed: EmbedBuilder[]}}
	 */
	static unmute (s) {
		this.mute(s, true);
	}

}