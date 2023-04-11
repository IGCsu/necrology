import ruLang from '../../langs/ru.json' assert { type: 'json' };
import enLang from '../../langs/en.json' assert { type: 'json' };

export class Lang {

	/**
	 * Кеш моделей
	 * @type {Object.<string, Lang>}
	 */
	static list = {};

	/**
	 * Локализация по умолчанию
	 * @type {string}
	 */
	static DEFAULT_LANG = 'ru';

	/**
	 * В локализации Дискорда, некоторые языки имеют дополнительные коды, которые
	 * добавляются при конвертировании
	 * @type {Object.<string, string[]>}
	 */
	static LANG_POSTFIX = {
		en: ['GB', 'US'],
		es: ['ES'],
		pt: ['BR'],
		sv: ['SE'],
		zh: ['CN', 'TW']
	};

	/**
	 * Текущая локализация
	 * @type {string}
	 */
	locale;

	/**
	 * Данные локализации
	 * @type {Object}
	 */
	data;

	/**
	 * @param {string} locale
	 * @param {Object} data
	 */
	constructor (locale, data) {
		this.locale = locale;
		this.data = data;
	}

	/**
	 * Инициализирует модели локализаций
	 */
	static init () {
		this.list = {
			ru: new this('ru', ruLang),
			en: new this('en', enLang)
		};
	}

	/**
	 * Возвращает модель локализацию.
	 * Использует локальную локализацию в приоритете, если её нет - берёт
	 * глобальную
	 * @param {string} localeGlobal Глобальная локализация
	 * @param {string} [localeLocal] Локальная локализация
	 * @returns {Lang}
	 */
	static get (localeGlobal, localeLocal) {
		let locale;

		if (localeLocal) {
			locale = localeLocal.substring(0, 2);
			if (this.list[locale]) {
				return this.list[locale];
			}
		}

		if (localeGlobal) {
			locale = localeGlobal.substring(0, 2);
			if (this.list[locale]) {
				return this.list[locale];
			}
		}

		return this.list[this.DEFAULT_LANG];
	}

	/**
	 * Возвращает локализованный текст
	 * @param {string} locale
	 * @returns {string}
	 */
	str (locale) {
		return this.data[locale] ??
			this.constructor.list[this.constructor.DEFAULT_LANG][locale] ?? locale;
	}

}