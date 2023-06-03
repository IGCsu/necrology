import { EmbedBuilder } from 'discord.js';
import { Const } from '../Const.js';

/**
 * Ошибка, которую мы кидаем, когда юзер хотим прервать работу скрипта
 * и вернуть юзеру текст ошибки
 */
export class UserError extends Error {

	/**
	 * Отправляет сообщение с ошибкой
	 * @param {InteractionSession} s
	 * @return {Promise<void>}
	 */
	async sendErrorMessage (s) {
		let embed = new EmbedBuilder();

		embed.setDescription(s._(this.message));
		embed.setColor(Const.COLOR_RED);

		await s.int.reply({
			embeds: [embed],
			ephemeral: true
		});

		s.logger.info('UserError: ' + this.message);
	}

}