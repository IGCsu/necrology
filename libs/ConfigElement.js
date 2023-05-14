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

}