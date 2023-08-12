import { LangCode, LangKey } from '../Lang';
import { ConfigKey } from './ConfigElement';
import { SnowflakeConfigElement } from './SnowflakeConfigElement';

export class ChannelIdConfigElement extends SnowflakeConfigElement {

	public static KEY: ConfigKey = 'channelId';
	public static NAME: LangKey = 'Config channelId name';
	public static DESC: LangKey = 'Config channelId desc';

	public readonly key: ConfigKey = ChannelIdConfigElement.KEY;
	public readonly name: LangKey = ChannelIdConfigElement.NAME;
	public readonly desc: LangKey = ChannelIdConfigElement.DESC;

	public constructor (value: LangCode) {
		super(value);
	}

}