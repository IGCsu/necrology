import dotenv from 'dotenv';
import { Router } from './libs/Router.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { Logger } from './libs/Logger.js';
import { DB } from './libs/DB.js';
import { Lang } from './mvc/models/Lang.js';

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildModeration
	]
});

Lang.init();
DB.init();
Router.init(client);

client.login(process.env.BOT_TOKEN).then(() => Logger.info('Bot is authorized!'));