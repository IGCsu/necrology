import { HelpView } from '../view/HelpView.js';
import { InteractionSession } from '../../libs/Session/InteractionSession';

export class HelpController {

	/**
	 * Команда выводит help сообщение
	 * @param {InteractionSession} s
	 */
	static async command (s) {
		await s.int.reply(HelpView.commandsList(s));
	}

}