import { BaseModel } from './BaseModel.js';

export class Action extends BaseModel {

	static TABLE_NAME = 'actions';
	static PRIMARY_KEY = 'id';
	static FIELDS = {
		type: 'number',
		guildId: 'string',
		targetId: 'string',
		executorId: 'string',
		messageId: 'string',
		threadId: 'string',
		reason: 'string',
		parentId: 'number',
		timestamp: 'number'
	};

	/**
	 * Список полей-индексов для поиска в кеше.
	 * Используются для формирования ключей поиска в кеше.
	 * Должен идти от самого сложного условия до самого простого.
	 * @type {[string[],string[],[string]]}
	 */
	static cacheKeys = [
		['targetId', 'guildId', 'type'], // Ключ поиска последнего действия по юзеру в гильдии и типу действия
		['targetId', 'guildId'], // Ключ поиска последнего действия по юзеру в гильдии
		['targetId'], // Ключ поиска последнего действия по юзеру

		['id', 'guildId'], // Ключ поиска действия в гильдии
		['id'] // Ключ поиска действия
	];

	/**
	 * Кеш моделей
	 * @type {Object.<string, Action>}
	 */
	static actions = {};

	static TYPE_WARN = 0;
	static TYPE_MUTE = 1;
	static TYPE_UNMUTE = 2;
	static TYPE_BAN = 3;
	static TYPE_UNBAN = 4;
	static TYPE_KICK = 5;

	static types = [
		this.TYPE_WARN,
		this.TYPE_MUTE,
		this.TYPE_UNMUTE,
		this.TYPE_BAN,
		this.TYPE_UNBAN,
		this.TYPE_KICK
	];

	/**
	 * ID варна
	 * @type {number}
	 */
	id;

	/**
	 * Тип варна
	 * @see Action.types
	 */
	type;

	/** @type {string} */
	guildId;

	/** @type {string} */
	targetId;

	/** @type {string} */
	executorId;

	/** @type {string} */
	messageId;

	/** @type {string} */
	threadId;

	/**
	 * Описание варна
	 * @type {string}
	 */
	reason;

	/**
	 * ID действия-родителя
	 * @type {string}
	 */
	parentId;

	/**
	 * Временная метка события
	 * @type {number}
	 */
	timestamp;

	/**
	 * @param {Object} data
	 * @param {boolean} [saved=false] определяет, сохранена ли модель в БД
	 */
	constructor (data, saved) {
		super(data, saved);
		if (data.id) this.id = data.id;
		if (data.type) this.type = data.type;
		if (data.guildId) this.guildId = data.guildId;
		if (data.targetId) this.targetId = data.targetId;
		if (data.executorId) this.executorId = data.executorId;
		if (data.messageId) this.messageId = data.messageId;
		if (data.threadId) this.threadId = data.threadId;
		if (data.reason) this.reason = data.reason;
		if (data.parentId) this.parentId = data.parentId;
		if (data.timestamp) this.timestamp = data.timestamp;
	}

	/**
	 * @param {number} id ID варна
	 * @param {string} [guildId] ID гильдии
	 * @return {Action|undefined}
	 */
	static getById (id, guildId) {
		let where = {
			id: id
		};

		if (guildId) {
			where.guildId = guildId;
		}

		return this.getBy(where);
	}

	/**
	 * @param {string} targetId
	 * @param {string} [guildId]
	 * @param {number} [type] Action.types
	 * @return {Action|undefined}
	 */
	static getLastByUser (targetId, guildId, type) {
		let where = {
			targetId: targetId
		};

		if (guildId) {
			where.guildId = guildId;
		}

		if (type) {
			where.type = type;
		}

		return this.getBy(where);
	}

	/**
	 * Получить модель по условию
	 * @param {Object} where
	 * @return {Action|undefined}
	 */
	static getBy (where) {
		let action = this.getFromCache(where);

		if (action) {
			return action;
		}

		action = this.selectQuery(where);

		if (!action) {
			return undefined;
		}

		action = new this(action, true);
		action.saveCache();

		return action;
	}

	/**
	 * Создаёт модель конфигурации сообщества
	 * @param {Object} data
	 * @param {number} data.type
	 * @param {string} data.guildId
	 * @param {string} data.targetId
	 * @param {string} data.executorId
	 * @param {string} data.messageId
	 * @param {string} data.threadId
	 * @param {string} data.reason
	 * @param {string} [data.parentId]
	 * @param {number} [data.timestamp]
	 * @return {Action}
	 */
	static create (data) {
		const defaultData = {
			timestamp: Date.now()
		};

		for (const key in defaultData) {
			if (!data[key]) data[key] = defaultData[key];
		}

		const action = new this(data);
		action.save();
		action.saveCache();

		return action;
	}

	/**
	 * Создаёт модель из EntrySession
	 * @param {number} type
	 * @param {EntrySession} s
	 * @param {Action} [action]
	 * @return {Action}
	 */
	static createFromEntrySession (type, s, action) {
		return this.create({
			type: type ?? action?.type,
			guildId: s.guild?.id ?? action?.guildId,
			targetId: s.targetMember?.id ?? action?.targetId,
			executorId: s.executorMember?.id ?? action?.executorId,
			messageId: s.message?.id ?? action?.messageId,
			threadId: s.thread?.id ?? action?.threadId,
			reason: s.entry?.reason ?? action?.reason,
			timestamp: s.timestamp.getTime() ?? action?.timestamp,
			parentId: action?.id
		});
	}

	/**
	 * Сохраняет модель в кеше
	 * @return {Action}
	 */
	saveCache () {
		for (const keys of this.constructor.cacheKeys) {
			let cacheKey = '';

			for (const field of keys) {
				cacheKey += ':' + field + ':' + this[field] + ':';
			}

			if (!this.constructor.actions[cacheKey] || this.id > this.constructor.actions[cacheKey].id) {
				this.constructor.actions[cacheKey] = this;
			}
		}

		return this;
	}

	/**
	 * Принимает объект условий, по которому необходимо получить объект
	 * @param {Object} where
	 * @return {Action|undefined}
	 */
	static getFromCache (where) {
		const whereFields = Object.keys(where);

		// Проверяем 2 массива на идентичность, находим индекс ключ кеша именно с теми полями, которые переданы
		const fields = this.cacheKeys.find(fields => {
			if (fields.length !== whereFields.length) {
				return false;
			}

			for (const field of fields) {
				if (whereFields.indexOf(field) === -1) {
					return false;
				}
			}

			return true;
		});

		if (!fields) {
			return undefined;
		}

		let cacheKey = '';
		for (const field of fields) {
			cacheKey += ':' + field + ':' + where[field] + ':';
		}

		return this.actions[cacheKey];
	}

}