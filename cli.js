import dotenv from 'dotenv';
import { MigrationScript } from './libs/Script/MigrationScript.js';
import { DB } from './libs/DB.js';
import { Logger } from './libs/Logger.js';

dotenv.config();
DB.init();

const script = process.argv[2];

switch (script) {
	case MigrationScript.SCRIPT_NAME:
		MigrationScript.execute();
		break;
	default:
		Logger.error('Script "' + script + '" not found');
		break;
}