import { ConfigView } from '../view/ConfigView.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Lang } from '../models/Lang.js';
import { Config } from '../models/Config.js';

export class ConfigController {

	static CONFIG_KEY_LANG = 'Config key';
	static CONFIG_VALUE_LANG = 'Config value';

	/**
	 * Команда выводит help сообщение
	 * @param {InteractionSession} s
	 */
	static async command (s) {
		await s.int.reply(ConfigView.commandsList(s));
	}

	/**
	 *
	 * @return {Object[]}
	 */
	static getCommandOptions () {
		let options = [];
		let choices = [];

		for (const key in Config.elements) {
			const element = Config.getElement(key);
			choices.push({
				name: element.name,
				nameLocalizations: Lang.toDiscord(element.name),
				value: element.key
			});
		}

		options.push({
			type: ApplicationCommandOptionType.String,
			name: 'key',
			description: Lang.getText(this.CONFIG_KEY_LANG),
			descriptionLocalizations: Lang.toDiscord(this.CONFIG_KEY_LANG),
			choices: choices
		});

		options.push({
			type: ApplicationCommandOptionType.String,
			name: 'value',
			description: Lang.getText(this.CONFIG_VALUE_LANG),
			descriptionLocalizations: Lang.toDiscord(this.CONFIG_VALUE_LANG)
		});

		return options;
	}

}