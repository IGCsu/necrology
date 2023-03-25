import { ChatInputCommandInteraction } from 'discord.js';
import { HelpView } from '../view/HelpView.js'

export class HelpController {

	/**
	 * Команда выводит help сообщение
	 * @param {Object} session
	 * @param {ChatInputCommandInteraction} session.int
	 * @param {Logger} session.logger
	 * @param {Config} session.config
	 * @param {Lang} session.lang
	 */
	static async helpCommand (session) {
		await session.int.reply(HelpView.commandsList());
	}

}