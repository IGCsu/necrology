import { Column, Entity, Equal, FindOptionsWhere, PrimaryColumn } from 'typeorm';
import { Snowflake } from 'discord-api-types/v6';
import { Lang, LangCode } from '../../libs/Lang';
import { LangConfigElement } from '../../libs/ConfigElement/LangConfigElement';
import { BaseModel } from './BaseModel';
import { ChannelIdConfigElement } from '../../libs/ConfigElement/ChannelIdConfigElement';

@Entity({ name: 'configs' })
export class Config extends BaseModel {

	@PrimaryColumn()
	protected guildId!: Snowflake;

	@Column()
	protected lang: LangCode = Lang.DEFAULT_LANG;

	@Column()
	protected channelId!: Snowflake;

	public static async findOneByGuildIdOrCreate (guildId: Snowflake): Promise<Config> {
		let config = await this.findOneByGuildId(guildId);

		if (config === null) {
			config = new Config();
			config.guildId = guildId;
		}

		return config;
	}

	public static findOneByGuildId (guildId: Snowflake): Promise<Config | null> {
		return Config.findOneBy({
			guildId: Equal(guildId)
		} as FindOptionsWhere<Config>);
	}

	public getGuildId (): Snowflake {
		return this.guildId;
	}

	public getLang (): LangConfigElement {
		return new LangConfigElement(this.lang);
	}

	public setLang (element: LangConfigElement): Config {
		this.lang = element.getValue();
		this.silentSave();
		return this;
	}

	public getChannelId (): ChannelIdConfigElement {
		return new ChannelIdConfigElement(this.channelId);
	}

	public setChannelId (element: ChannelIdConfigElement): Config {
		this.channelId = element.getValue();
		this.silentSave();
		return this;
	}

}