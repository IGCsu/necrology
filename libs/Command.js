import {
	ApplicationCommand,
	ApplicationCommandType,
	PermissionsBitField
} from 'discord.js';
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
	 * Права, необходимые для доступа к команде
	 * @type {PermissionsBitField}
	 */
	perm;

	/**
	 * Опции команды
	 * @type {Object[]}
	 */
	options;

	/**
	 * @param {string} data.name
	 * @param {function} [data.func]
	 * @param {number} [data.type]
	 * @param {PermissionsBitField} [data.perm]
	 * @param {Object.<string, string>} [data.desc]
	 * @param {Object[]} [data.options]
	 */
	constructor (data) {
		this.name = data.name;
		if (data.func) this.func = data.func;
		if (data.type) this.type = data.type;
		if (data.perm) this.perm = data.perm;
		if (data.desc) this.desc = data.desc;
		if (data.options) this.options = data.options;
	}

	/**
	 * Создаёт команду
	 * @param {string} name
	 * @param {function} [func]
	 * @param {number} [type]
	 * @return this
	 */
	static create (name, func, type) {
		return new this({
			name: name,
			func: func,
			type: type
		});
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
	setDescFromObject (desc) {
		for (const key in desc) {
			this.setDesc(key, desc[key]);
		}

		return this;
	}

	/**
	 * @param {string} locale
	 * @param {string} text
	 * @return this
	 */
	setDesc (locale, text) {
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

	/**
	 * @param {PermissionsBitField} perm
	 * @return this
	 */
	setPerm (perm) {
		this.perm = perm;
		return this;
	}

	/**
	 * @param {PermissionsBitField} option
	 * @return this
	 */
	addOption (option) {
		this.options.push(option);
		return this;
	}

	toDiscord () {
		let result = {
			name: this.name,
			type: this.type
		};

		result.description = this.desc[Lang.DEFAULT_LANG];

		if (!result.description) {
			throw new ReferenceError(
				'Missing description of command "' + this.name + '" in default language'
			);
		}

		result.descriptionLocalizations = {};

		for (let locale in this.desc) {
			if (Lang.LANG_POSTFIX.hasOwnProperty(locale)) {
				for (const postfix of Lang.LANG_POSTFIX[locale]) {
					result.descriptionLocalizations[locale + '-' + postfix] =
						this.desc[locale];
				}
			} else {
				result.descriptionLocalizations[locale] = this.desc[locale];
			}
		}

		return result;
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