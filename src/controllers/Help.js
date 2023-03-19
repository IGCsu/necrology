import { ChatInputCommandInteraction } from 'discord.js';

export class Help {

	/**
	 * Команда выводит help сообщение
	 * @param {ChatInputCommandInteraction} int
	 */
	static async helpCommand (int) {
		await int.reply({
			content: 'help'
		});
	}

}