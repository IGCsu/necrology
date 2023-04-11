import { CommandRepository } from '../../libs/CommandRepository.js';

export class HelpView {

	/**
	 * Возвращает список команд
	 * @param {InteractionSession} s
	 */
	static commandsList (s) {
		let commands = [];

		CommandRepository.each(command => {
			commands.push(command.toString(s.lang.locale));
		});

		return {
			content: commands.join(commands)
		};
	}

}