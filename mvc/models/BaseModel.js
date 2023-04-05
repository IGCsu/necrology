import { DB } from '../../libs/DB.js';

export class BaseModel {

	static TABLE_NAME;
	static PRIMARY_KEY;
	static FIELDS = {};

	/**
	 * Если true - значит модель есть в БД.
	 * Если false - значит модель существует только в кеше
	 * @type {boolean}
	 */
	saved = false;

	/**
	 * @param {Object} data
	 * @param {boolean} [saved=false] определяет, сохранена ли модель в БД
	 */
	constructor (data, saved) {
		if (saved) this.saved = true;
	}

	/**
	 * Сохраняет модель.
	 * @return {this}
	 */
	save () {
		const TABLE_NAME = this.constructor.TABLE_NAME;
		const FIELDS = this.constructor.FIELDS;
		const PRIMARY_KEY = this.constructor.PRIMARY_KEY;

		if (this.saved && this[PRIMARY_KEY] !== undefined) {
			// Модель есть, обновим её в БД
			let fields = [];
			let data = [];

			for (const key in FIELDS) {
				if (this[key] === undefined || typeof this[key] !== FIELDS[key]) {
					continue;
				}

				fields.push(key + ' = ?');
				data.push(this[key]);
			}

			data.push(this[PRIMARY_KEY]);

			DB.query(
				'UPDATE ' + TABLE_NAME + ' SET ' + fields.join(', ') + ' WHERE ' +
				PRIMARY_KEY + ' = ?',
				data
			);
		} else {
			// Модели нет, добавим её в БД и сохраним вставленный первичный ключ
			let fields = [];
			let values = [];
			let data = [];

			for (const key in FIELDS) {
				if (this[key] === undefined || typeof this[key] !== FIELDS[key]) {
					continue;
				}

				fields.push(key);
				values.push('?');
				data.push(this[key]);
			}

			const sql = 'INSERT INTO ' + TABLE_NAME + ' (' + fields.join(', ') +
				') VALUES (' + values.join(', ') + ')';

			const result = DB.query(sql, data);

			if (result.insertId) {
				this[PRIMARY_KEY] = result.insertId;
			}

			this.saved = true;
		}

		return this;
	}

	/**
	 * Делает запрос к БД с указанными параметрами.
	 * Возвращает список строк или строку, если лимит 1
	 * @param {Object.<string, string|number>} where
	 * @param {number} [limit=1]
	 * @param {string[]|string} [select='*']
	 * @param {(string|boolean)[]} [order=] Определяет направление сортировки
	 *   [поле, направление], true - по убыванию (по умолчанию), false - по
	 *   возрастанию
	 * @return {Object|Object[]}
	 */
	static selectQuery (where, limit, select, order) {
		let whereRaw = [];
		let whereValues = [];
		for (const field in where) {
			whereValues.push(where[field]);
			whereRaw.push(field + ' = ?');
		}

		if (!limit) {
			limit = 1;
		}

		if (!select) {
			select = ['*'];
		}

		if (typeof select === 'string') {
			select = [select];
		}

		let sql = '';

		sql += 'SELECT ' + select.join();
		sql += ' FROM ' + this.TABLE_NAME;
		sql += ' WHERE ' + whereRaw.join(' AND ');

		if (!order) {
			order = [];
		}

		sql += ' ORDER BY ' + (order[0] ?? this.PRIMARY_KEY);
		sql += ' ' + (order[1] ? 'ASC' : 'DESC');

		sql += ' LIMIT ' + limit;

		const result = DB.query(sql, whereValues);

		if (result[0]) {
			return limit === 1 ? result[0] : result;
		}
	}

}