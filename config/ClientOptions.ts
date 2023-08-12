import { ClientOptions, GatewayIntentBits } from 'discord.js';

export const clientOptions: ClientOptions = {
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration
	]
};