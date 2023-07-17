import { ApplicationCommandOptionType } from 'discord.js';
import { Lang } from '../models/Lang.js';
import { Config } from '../models/Config.js';
import { UserError } from '../../libs/Error/UserError.js';
import { ConfigView } from '../view/ConfigView.js';
import { InvalidArgumentError } from '../../libs/Error/InvalidArgumentError.js';

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

		try {
			if (value === null) {
				await this.actionGet(s, key);
			} else {
				await this.actionSet(s, key, value);
			}
		} catch (err) {
			if (err instanceof InvalidArgumentError) {
				throw UserError(err.message, { cause: err });
			}

			throw err;
		}
	}

	/**
	 * @param {InteractionSession} s
	 */
	static async actionIndex (s) {
		s.logger.info('Start actionIndex');

		await s.int.reply(ConfigView.index(s));
	}

	/**
	 * @param {InteractionSession} s
	 * @param {string} key
	 */
	static async actionGet (s, key) {
		s.logger.info('Start actionGet', { key: key });

		await s.int.reply(ConfigView.get(s, key));
	}

	/**
	 * @param {InteractionSession} s
	 * @param {string} key
	 * @param {string} value
	 */
	static async actionSet (s, key, value) {
		s.logger.info('Start actionSet', { key: key, value: value });

		await s.int.deferReply();

		const element = Config.getElement(key);

		value = Config.prepareValue(element.type, value);

		await this.validateValue(s, element, value);

		const oldValue = s.config.get(key);

		if (oldValue !== value) {
			s.config.set(key, value);
			s.logger.info('Value changed');
		}

		await s.int.followUp(ConfigView.set(s, key, oldValue));

		s.logger.info('End actionSet');
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

	/**
	 * @param {InteractionSession} s
	 * @param {ConfigElement} element
	 * @param {string} value
	 * @return {Promise<*>}
	 */
	static async validateValue (s, element, value) {
		let preparedValue;
		const isNumberType = element.type === ApplicationCommandOptionType.Number
			|| element.type === ApplicationCommandOptionType.Integer;

		switch (element.type) {
			case ApplicationCommandOptionType.User:
				try {
					preparedValue = await s.guild.members.fetch({ id: value });
				} catch (err) {
					throw new UserError('User not found in guild', { cause: err });
				}
				break;

			case ApplicationCommandOptionType.Channel:
				try {
					preparedValue = await s.guild.channels.fetch(value);
				} catch (err) {
					throw new UserError('Channel not found in guild', { cause: err });
				}
				break;

			case ApplicationCommandOptionType.Role:
				try {
					preparedValue = await s.guild.roles.fetch(value);
				} catch (err) {
					throw new UserError('Role not found in guild', { cause: err });
				}
				break;
			default:
				preparedValue = value;
		}

		if (
			preparedValue === undefined
			|| preparedValue === null
			|| (isNumberType && isNaN(preparedValue))
		) {
			throw new UserError('Value is invalid');
		}

		await element.validateValue(preparedValue);
	}

}