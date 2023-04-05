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
	 * Текущая локализация
	 * @type {string}
	 */
	lang;

	/**
	 * Данные локализации
	 * @type {Object}
	 */
	data;

	/**
	 * @param {string} lang
	 * @param {Object} data
	 */
	constructor (lang, data) {
		this.lang = lang;
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
	 * @param {string} langGlobal Глобальная локализация
	 * @param {string} [langLocal] Локальная локализация
	 * @returns {Lang}
	 */
	static get (langGlobal, langLocal) {
		let lang;

		if (langLocal) {
			lang = langLocal.substring(0, 2);
			if (this.list[lang]) {
				return this.list[lang];
			}
		}

		if (langGlobal) {
			lang = langGlobal.substring(0, 2);
			if (this.list[lang]) {
				return this.list[lang];
			}
		}

		return this.list[this.DEFAULT_LANG];
	}

	/**
	 * Возвращает локализованный текст
	 * @param {string} code
	 * @returns {string}
	 */
	str (code) {
		return this.data[code] ??
			this.constructor.list[this.constructor.DEFAULT_LANG][code] ?? code;
	}

}