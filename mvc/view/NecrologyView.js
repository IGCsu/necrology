import { EmbedBuilder } from 'discord.js';

export class NecrologyView {

	static getMuteEmbed () {
		let embed = new EmbedBuilder()
			.setTitle('Выдан мут ' + time)
			.setColor(2075752)
			.setTimestamp()
			.setThumbnail(after.user.avatarURL({ dynamic: true }))
			.setDescription(
				'**Пользователь:** <@' + after.user.id + '>' +
				'\n**ID пользователя:** `' + after.user.id +
				'`\n**Причина:** `' +
				(advancedMuteData?.reason ? advancedMuteData.reason : 'не указана') +
				'`\n**Размут** <t:' +
				Math.floor(after.communicationDisabledUntilTimestamp / 1000) + ':R>'
			);

		if (advancedMuteData?.author) {
			embed.setFooter({
				iconURL: advancedMuteData.author.displayAvatarURL({ dynamic: true }),
				text: advancedMuteData.author.username + '#' +
					advancedMuteData.author.discriminator
			});
		}
	}

}