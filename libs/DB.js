import MySQL from 'sync-mysql';

export class DB {

	/**
	 * Коннект к БД
	 * @type {Object}
	 */
	static connection;

	/**
	 * Инициализирует подключение к БД
	 */
	static init () {
		this.connection = new MySQL({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			charset: 'utf8mb4'
		});
	}

	/**
	 * Выполняет запрос к БД
	 * @param {string} str SQL запрос
	 * @param {number[]|string[]} [values] Данные для подстановки
	 */
	static query (str, values) {
		return this.connection.query(str, values);
	}

}