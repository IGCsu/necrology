import ruLang from '../../langs/ru.json' assert { type: 'json' };
import enLang from '../../langs/en.json' assert { type: 'json' };

export class Lang {

	/**
	 * Кеш моделей
	 * @type {Object.<string, Lang>}
	 */
	static list = {
		ru: new this('ru', ruLang),
		en: new this('en', enLang)
	};

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
	 * @type {string} Код локализации ISO 639-1
	 */
	locale;

	/**
	 * Данные локализации
	 * @type {Object}
	 */
	data;

	/**
	 * @param {string} locale Код локализации ISO 639-1
	 * @param {Object} data
	 */
	constructor (locale, data) {
		this.locale = locale;
		this.data = data;
	}

	/**
	 * Возвращает модель локализацию.
	 * Использует локальную локализацию в приоритете, если её нет - берёт
	 * глобальную
	 * @param {string} localeGlobal Глобальная локализация в ISO 639-1
	 * @param {string} [localeLocal] Локальная локализация в ISO 639-1
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
	 * Возвращает текст по локализации
	 * @param {string} key Ключ текста
	 * @param {string} [locale=Lang.DEFAULT_LANG] Код локализации ISO 639-1
	 * @return {string}
	 */
	static getText (key, locale) {
		if (!locale) {
			locale = this.DEFAULT_LANG;
		}

		if (typeof locale !== 'string' || locale.length !== 2) {
			throw new TypeError('Locale "' + locale + '" invalid');
		}

		return this.get(locale).str(key);
	}

	/**
	 * Формирует объект локализированных текстов для Дискорда
	 * @param {string} key Ключ текста
	 * @return {Object.<string, string>}
	 */
	static toDiscord (key) {
		let result = {};

		for (let locale in this.list) {
			if (Lang.LANG_POSTFIX.hasOwnProperty(locale)) {
				const text = this.getText(key, locale);
				for (const postfix of Lang.LANG_POSTFIX[locale]) {
					result[locale + '-' + postfix] = text;
				}
			} else {
				result[locale] = this.getText(key, locale);
			}
		}

		return result;
	}

	/**
	 * Возвращает локализованный текст
	 * @param {string} key
	 * @returns {string}
	 */
	str (key) {
		return this.data[key] ??
			this.constructor.list[this.constructor.DEFAULT_LANG][key] ?? key;
	}

}