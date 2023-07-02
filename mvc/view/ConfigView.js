import { Config } from '../models/Config.js';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export class ConfigView {

	/**
	 * Возвращает список команд
	 * @param {InteractionSession} s
	 * @return {{embeds: EmbedBuilder[]}}
	 */
	static index (s) {
		let desc = s._('Config index desc') + '\n';

		for (const key in Config.elements) {
			const element = Config.getElement(key);
			let text = '';

			text += '- ' + s._(element.name) + ': ';
			text += this.prepareValue(element, s.config.get(key));

			desc += '\n' + text;
		}

		return {
			embeds: [
				new EmbedBuilder()
					.setTitle(s._('Bot config'))
					.setDescription(desc)
			]
		};
	}

	/**
	 * Возвращает список команд
	 * @param {InteractionSession} s
	 * @param {string} key
	 * @return {{embeds: EmbedBuilder[]}}
	 */
	static get (s, key) {
		const element = Config.getElement(key);
		const type = ApplicationCommandOptionType[element.type];
		const value = s.config.get(key);
		const preparedValue = this.prepareValue(element, value);
		const rawValue = '`' + value + '`';

		let desc = s._(element.desc) + '\n';

		desc += '\n**' + s._('Value') + ':** ' + preparedValue;
		if (rawValue !== preparedValue) {
			desc += '\n**' + s._('Raw value') + ':** ' + rawValue;
		}
		desc += '\n**' + s._('Key') + ':** ' + element.key;
		desc += '\n**' + s._('Type') + ':** ' + type;

		return {
			embeds: [
				new EmbedBuilder()
					.setTitle(s._(element.name))
					.setDescription(desc)
			]
		};
	}

	/**
	 * Возвращает изменения
	 * @param s
	 * @param key
	 * @param oldValue
	 */
	static set (s, key, oldValue) {
		const element = Config.getElement(key);
		const preparedOldValue = this.prepareValue(element, oldValue);
		const preparedNewValue = this.prepareValue(element, s.config.get(key));

		let desc = s._('Value changed') + ' - ' + element.name + '\n';

		desc += '\n' + s._('Old value') + ': ' + preparedOldValue;
		desc += '\n' + s._('New value') + ': ' + preparedNewValue;

		const embed = new EmbedBuilder()
			.setDescription(desc);

		return {
			embeds: [embed]
		};
	}

	/**
	 * Переводит значение в человеко-понятный вид
	 * @param {ConfigElement} element
	 * @param {string} value
	 * @return {string}
	 */
	static prepareValue (element, value) {
		switch (element.type) {
			case ApplicationCommandOptionType.Boolean:
				return value ? '`true`' : '`false`';

			case ApplicationCommandOptionType.Role:
				return '<@&' + value + '>';

			case ApplicationCommandOptionType.User:
				return '<@' + value + '>';

			case ApplicationCommandOptionType.Channel:
				return '<#' + value + '>';

			default:
				return '`' + value + '`';
		}
	}

}