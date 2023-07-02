import fs from 'fs';
import { DB } from '../DB.js';
import { InvalidArgumentError } from '../Error/InvalidArgumentError.js';
import { BaseScript } from './BaseScript.js';

export class MigrationScript extends BaseScript {

	static SCRIPT_NAME = 'migrate';

	static TYPE_DOWN = 'down';
	static TYPE_UP = 'up';

	static PATH_MIGRATIONS_DIR = './config/migrations/';

	static execute () {
		super.execute();

		let [type, file] = this.args;

		if (file === 'all') {
			this.all(type);
		} else {
			this.use(file);
		}
	}

	static use (file) {
		let sql;

		try {
			sql = fs.readFileSync(
				this.PATH_MIGRATIONS_DIR + file,
				'utf8'
			);
		} catch (e) {
			throw new InvalidArgumentError('File not found');
		}

		DB.query(sql);
	}

	/**
	 *
	 * @param {string} type
	 * @return {string[]}
	 */
	static all (type) {
		if (type !== MigrationScript.TYPE_UP && type !==
			MigrationScript.TYPE_DOWN) {
			throw new InvalidArgumentError('Type invalid');
		}

		let migrations = fs
			.readdirSync(this.PATH_MIGRATIONS_DIR)
			.filter(a => a.indexOf('-' + type + '.sql') !== -1);

		for (const migration of migrations) {
			this.use(migration);
		}
	}

}