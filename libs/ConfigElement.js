import { ApplicationCommandOptionType } from 'discord.js';

export class ConfigElement {

	/**
	 * Ключ настройки
	 * @type {string}
	 */
	key;

	/**
	 * Код наименования настройки
	 * @type {string}
	 */
	name;

	/**
	 * Код описания настройки
	 * @type {string}
	 */
	desc;

	/**
	 * Тип настройки
	 * @type {number}
	 */
	type = ApplicationCommandOptionType.String;

	/**
	 * Определяет глубину хранения значения
	 * true - данные лежат в config.data
	 * false - данные лежат в config
	 * @type {boolean}
	 */
	deepData = false;

	/**
	 * @param {string} data.key
	 */
	constructor (data) {
		this.key = data.key;
	}

	/**
	 * Создаёт настройку бота
	 * @param {string} key
	 * @return {ConfigElement}
	 */
	static create (key) {
		return new this({
			key: key
		});
	}

	/**
	 * Устанавливает наименование настройки
	 * @param {string} name
	 * @return {ConfigElement}
	 */
	setName (name) {
		this.name = name;
		return this;
	}

	/**
	 * Устанавливает описание настройки
	 * @param {string} desc
	 * @return {ConfigElement}
	 */
	setDesc (desc) {
		this.desc = desc;
		return this;
	}

	/**
	 * Устанавливает тип команды
	 * @param {number} type
	 * @return {ConfigElement}
	 */
	setType (type) {
		if (!ApplicationCommandOptionType[type]) {
			throw new InvalidArgumentError(
				'Config element type ' + type + ' not found'
			);
		}

		this.type = type;
		return this;
	}

	/**
	 * Устанавливает глубину хранения
	 * @param {boolean} deepData
	 * @return {ConfigElement}
	 */
	setDeepData (deepData) {
		this.deepData = deepData;
		return this;
	}

}