import { config } from 'dotenv';
import { clientOptions } from './config/ClientOptions';
import { Client } from 'discord.js';
import { DB } from './libs/DB';

!async function () {
	config();

	const client = new Client(clientOptions);

	console.log('lol');

	await DB.init();

	// const c = await Config.findOneByGuildId('921532106914537502');

	console.log(c);

	process.exit(1);
	// await client.login(process.env.BOT_TOKEN);
}();