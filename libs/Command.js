import { ApplicationCommand, ApplicationCommandType } from 'discord.js';
import { Lang } from '../mvc/models/Lang.js';

export class Command {

	/**
	 * @type {ApplicationCommand}
	 */
	app;

	/**
	 * Функция-слушатель ивента
	 * @function
	 */
	func;

	/**
	 * Наименование команды
	 * @type {string}
	 */
	name;

	/**
	 * Описание команды на разных языках
	 * @type {Object.<string, string>}
	 */
	desc = {};

	/**
	 * Тип команды
	 * @see ApplicationCommandType.ChatInput
	 * @see ApplicationCommandType.User
	 * @see ApplicationCommandType.Message
	 * @type {number}
	 */
	type = ApplicationCommandType.ChatInput;

	/**
	 * @param {string} name
	 * @param {function} [func]
	 * @param {number} [type]
	 * @param {Object.<string, string>} [desc]
	 */
	constructor (name, func, type, desc) {
		this.name = name;
		if (func) this.func = func;
		if (type) this.type = type;
		if (desc) this.desc = desc;
	}

	/**
	 * Создаёт команду
	 * @param {string} name
	 * @param {function} [func]
	 * @param {number} [type]
	 * @param {Object.<string, string>} [desc]
	 * @return this
	 */
	static create (name, func, type, desc) {
		return new this(name, func, type, desc);
	}

	/**
	 * @param {function} func
	 * @return this
	 */
	setFunc (func) {
		this.func = func;
		return this;
	}

	/**
	 * @param {Object.<string, string>} desc
	 * @return this
	 */
	setDesc (desc) {
		this.desc = desc;
		return this;
	}

	/**
	 * @param {string} locale
	 * @param {string} text
	 * @return this
	 */
	addDesc (locale, text) {
		this.desc[locale] = text;
		return this;
	}

	/**
	 * @param {ApplicationCommand} app
	 * @return this
	 */
	setApp (app) {
		this.app = app;
		return this;
	}

	/**
	 * @param {number} type
	 * @return this
	 */
	setType (type) {
		this.type = type;
		return this;
	}

	toDiscord () {
		const description = this.desc[Lang.DEFAULT_LANG];

		if (!description) {
			throw new ReferenceError(
				'Missing description of command "' + this.name + '" in default language'
			);
		}

		let description_localizations = {};

		for (let locale in this.desc) {
			if (Lang.LANG_POSTFIX.hasOwnProperty(locale)) {
				for (const postfix of Lang.LANG_POSTFIX[locale]) {
					description_localizations[locale + '-' + postfix] = this.desc[locale];
				}
			} else {
				description_localizations[locale] = this.desc[locale];
			}
		}

		return {
			name: this.name,
			type: this.type,
			description: description,
			description_localizations: description_localizations
		};
	}

	/**
	 * @param {string} [locale=Lang.DEFAULT_LANG]
	 * @return {string}
	 */
	toString (locale) {
		if (!locale) locale = Lang.DEFAULT_LANG;

		return '</' + this.name + ':' + this.app.id + '> - ' + this.desc[locale];
	}

}