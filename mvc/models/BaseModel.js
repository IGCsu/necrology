import { DB } from '../../libs/DB.js';
import { Logger } from '../../libs/Logger.js';

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
				'UPDATE ' + TABLE_NAME + ' SET ' + fields.join(', ') + ' WHERE ' + PRIMARY_KEY + ' = ?',
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

			const sql = 'INSERT INTO ' + TABLE_NAME + ' (' + fields.join(', ') + ') VALUES (' + values.join(', ') + ')';

			const result = DB.query(sql, data);

			if (result.insertId) {
				this[PRIMARY_KEY] = result.insertId;
				this.saved = true;
			} else {
				Logger.error('Row not inserted', { result: result, sql: sql, data: data });
			}

		}

		return this;
	}

}