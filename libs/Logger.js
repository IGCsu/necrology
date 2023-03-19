export class Logger {

	/**
	 * ANSI escape code
	 * @type {Object}
	 */
	static c = {

		/** Сброс эффектов */
		RESET: '\x1b[0m',

		BRIGHT: '\x1b[1m',
		DIM: '\x1b[2m',
		UNDERSCORE: '\x1b[4m',
		BLINK: '\x1b[5m',
		REVERSE: '\x1b[7m',
		HIDDEN: '\x1b[8m',

		/**
		 * Цвета текста
		 * @type {Object}
		 */
		FG: {
			BLACK: '\x1b[30m',
			RED: '\x1b[31m',
			GREEN: '\x1b[32m',
			YELLOW: '\x1b[33m',
			BLUE: '\x1b[34m',
			MAGENTA: '\x1b[35m',
			CYAN: '\x1b[36m',
			WHITE: '\x1b[37m',
			CRIMSON: '\x1b[38m'
		},

		/**
		 * Цвет фона
		 * @type {Object}
		 */
		BG: {
			BLACK: '\x1b[40m',
			RED: '\x1b[41m',
			GREEN: '\x1b[42m',
			YELLOW: '\x1b[43m',
			BLUE: '\x1b[44m',
			MAGENTA: '\x1b[45m',
			CYAN: '\x1b[46m',
			WHITE: '\x1b[47m',
			CRIMSON: '\x1b[48m'
		}

	};

	/**
	 * Возвращает временную метку в формате MySQL DATETIME
	 * @return {string}
	 */
	static getCurrentTimestamp () {
		return new Date().toTimeString().replace(/ .*/, '');
	}

	/**
	 * ID активного сообщества Дискорд
	 * @return {string}
	 */
	guildId;

	/**
	 * @param {string} [data.guildId]
	 */
	constructor (data) {
		if (data.guildId) this.guildId = data.guildId;
	}

	/**
	 * Инициализирует логгер
	 * @param {string} guildId
	 */
	static init (guildId) {
		return new this({
			guildId: guildId
		});
	}

	/**
	 * Отправляет сообщение в лог
	 * @param {string} color Цвет лога
	 * @param {string} str Сообщение лога
	 * @param {any} data Данные в лог
	 * @param {string} [guildId] ID сообщества
	 */
	static send (color, str, data, guildId) {
		data = data ? '\n' + JSON.stringify(data) : '';
		guildId = guildId ? ' [' + guildId + ']' : '';

		console.log(this.c.RESET + this.getCurrentTimestamp() + guildId + ' ' + color + str + data + this.c.RESET);
	}

	/**
	 * Отправляет сообщение в лог
	 * @param {string} color Цвет лога
	 * @param {string} str Сообщение лога
	 * @param {any} [data] Данные в лог
	 */
	send (color, str, data) {
		this.constructor.send(color, str, data, this.guildId);
	}

	/**
	 * Отправляет сообщение информации в лог
	 * @param {string} str Сообщение лога
	 * @param {any} [data] Данные в лог
	 * @param {string} [guildId] ID сообщества
	 */
	static info (str, data, guildId) {
		this.send(this.c.FG.CYAN, str, data, guildId);
	}

	/**
	 * Отправляет сообщение информации в лог
	 * @param {string} str Сообщение лога
	 * @param {any} [data] Данные в лог
	 */
	info (str, data) {
		this.constructor.info(str, data, this.guildId);
	}

	/**
	 * Отправляет сообщение предупреждения в лог
	 * @param {string} str Сообщение лога
	 * @param {any} [data] Данные в лог
	 * @param {string} [guildId] ID сообщества
	 */
	static warn (str, data, guildId) {
		this.send(this.c.FG.YELLOW, '[WARN] ' + str, data, guildId);
	}

	/**
	 * Отправляет сообщение предупреждения в лог
	 * @param {string} str Сообщение лога
	 * @param {any} [data] Данные в лог
	 */
	warn (str, data) {
		this.constructor.warn(str, data, this.guildId);
	}

	/**
	 * Отправляет сообщение ошибки в лог
	 * @param {string} str Сообщение лога
	 * @param {any} [data] Данные в лог
	 * @param {string} [guildId] ID сообщества
	 */
	static error (str, data, guildId) {
		this.send(this.c.FG.RED, '[ERROR] ' + str, data, guildId);
	}

	/**
	 * Отправляет сообщение ошибки в лог
	 * @param {string} str Сообщение лога
	 * @param {any} [data] Данные в лог
	 */
	error (str, data) {
		this.constructor.error(str, data, this.guildId);
	}

}