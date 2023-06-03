import { ApplicationCommandOptionType } from 'discord.js';
import { Lang } from '../models/Lang.js';
import { Config } from '../models/Config.js';
import { UserError } from '../../libs/Error/UserError.js';

export class ConfigController {

	static CONFIG_KEY_LANG = 'Config key';
	static CONFIG_VALUE_LANG = 'Config value';

	static CONFIG_KEY_OPTION_NAME = 'key';
	static CONFIG_VALUE_OPTION_NAME = 'value';

	/**
	 * Роутит обработку команды
	 * @param {InteractionSession} s
	 */
	static async command (s) {
		const key = s.int.options.getString(this.CONFIG_KEY_OPTION_NAME);
		const value = s.int.options.getString(this.CONFIG_VALUE_OPTION_NAME);

		if (key === null && value === null) {
			await this.actionIndex(s);
			return;
		}

		if (key === null) {
			throw new UserError('Key field is required!');
		}

		if (value === null) {
			await this.actionGet(s, key);
		} else {
			await this.actionSet(s, key, value);
		}
	}

	/**
	 * @param {InteractionSession} s
	 */
	static async actionIndex (s) {
		s.logger.info('Start actionIndex');
	}

	/**
	 * @param {InteractionSession} s
	 * @param {string} key
	 */
	static async actionGet (s, key) {
		s.logger.info('Start actionIndex', { key: key });
	}

	/**
	 * @param {InteractionSession} s
	 * @param {string} key
	 * @param {string} value
	 */
	static async actionSet (s, key, value) {
		s.logger.info('Start actionIndex', { key: key, value: value });
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
			name: this.CONFIG_KEY_OPTION_NAME,
			description: Lang.getText(this.CONFIG_KEY_LANG),
			descriptionLocalizations: Lang.toDiscord(this.CONFIG_KEY_LANG),
			choices: choices
		});

		options.push({
			type: ApplicationCommandOptionType.String,
			name: this.CONFIG_VALUE_OPTION_NAME,
			description: Lang.getText(this.CONFIG_VALUE_LANG),
			descriptionLocalizations: Lang.toDiscord(this.CONFIG_VALUE_LANG)
		});

		return options;
	}

}