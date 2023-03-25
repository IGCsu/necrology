import { HelpView } from '../view/HelpView.js';
import { InteractionSession } from '../../libs/Session/InteractionSession.js';

export class HelpController {

	/**
	 * Команда выводит help сообщение
	 * @param {InteractionSession} s
	 */
	static async helpCommand (s) {
		await s.int.reply(HelpView.commandsList());
	}

}