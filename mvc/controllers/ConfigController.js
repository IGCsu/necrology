import { ConfigView } from '../view/ConfigView.js';

export class ConfigController {

	/**
	 * Команда выводит help сообщение
	 * @param {InteractionSession} s
	 */
	static async command (s) {
		await s.int.reply(ConfigView.commandsList(s));
	}

}