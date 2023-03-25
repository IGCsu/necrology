import { DB } from '../../libs/DB.js';
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
		timestamp: 'number'
	};

	/**
	 * Кеш моделей
	 * @type {Object.<number, Action>}
	 */
	static actions = {};

	static TYPE_WARN = 0;
	static TYPE_MUTE = 1;
	static TYPE_UNMUTE = 2;
	static TYPE_BAN = 3;
	static TYPE_UNBAN = 4;

	static types = [
		this.TYPE_WARN,
		this.TYPE_MUTE,
		this.TYPE_UNMUTE,
		this.TYPE_BAN,
		this.TYPE_UNBAN
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
		if (data.timestamp) this.timestamp = data.timestamp;
	}

	/**
	 * @param id ID варна
	 * @return {Action}
	 */
	static getById (id) {
		if (this.actions[id]) {
			return this.actions[id];
		}

		const action = DB.query('SELECT * FROM ' + this.TABLE_NAME + ' WHERE id = ? LIMIT 1', [id]);

		return action[0] ? this.actions[id] = new this(action[0], true) : undefined;
	}

	/**
	 * Создаёт модель конфигурации сообщества
	 * @param {Object} data
	 * @param {number} data.type;
	 * @param {string} data.guildId;
	 * @param {string} data.targetId;
	 * @param {string} data.executorId;
	 * @param {string} data.messageId;
	 * @param {string} data.threadId;
	 * @param {string} data.reason;
	 * @param {number} [data.timestamp];
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

		return this.actions[action.id] = action;
	}

	/**
	 * Создаёт модель из EntrySession
	 * @param {number} type
	 * @param {EntrySession} s
	 * @return {Action}
	 */
	static createFromEntrySession (type, s) {
		return this.create({
			type: type,
			guildId: s.guild.id,
			targetId: s.targetMember.id,
			executorId: s.executorMember.id,
			messageId: s.message.id,
			threadId: s.thread.id,
			reason: s.entry.reason,
			timestamp: s.timestamp.getTime()
		});
	}

}