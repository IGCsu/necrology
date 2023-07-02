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

		const message = {
			embeds: [embed],
			ephemeral: true
		};

		s.int.deferred
			? await s.int.followUp(message)
			: await s.int.reply(message);

		s.logger.info('UserError: ' + this.message);

		if (this.cause) {
			s.logger.warn(this.cause);
		}
	}

}