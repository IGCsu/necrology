import { CommandRepository } from '../../libs/CommandRepository.js';
import { EmbedBuilder } from 'discord.js';

export class HelpView {

	/**
	 * Возвращает список команд
	 * @param {InteractionSession} s
	 */
	static commandsList (s) {
		let embed = new EmbedBuilder();
		let commands = [];

		CommandRepository.each(command => {
			commands.push(command.toString(s.lang.locale));
		});

		embed.setTitle(s._('Help title'));
		embed.setDescription(s._('Help desc'));
		embed.addFields({
			name: s._('Help commands'),
			value: commands.join('\n'),
			inline: false
		});

		return {
			embeds: [embed]
		};
	}

}