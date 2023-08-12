import { Lang, LangCode, LangKey } from '../Lang';
import { ConfigElement, ConfigKey, ConfigValue } from './ConfigElement';
import { UserError } from '../Error/UserError';

export class LangConfigElement extends ConfigElement {

	public static KEY: ConfigKey = 'lang';
	public static NAME: LangKey = 'Config lang name';
	public static DESC: LangKey = 'Config lang desc';

	public readonly key: ConfigKey = LangConfigElement.KEY;
	public readonly name: LangKey = LangConfigElement.NAME;
	public readonly desc: LangKey = LangConfigElement.DESC;

	public constructor (value: LangCode) {
		super(value);
	}

	public getValue (): LangCode {
		return super.getValue();
	}

	protected prepareValue (value: ConfigValue): ConfigValue {
		value = String(value);

		if (value.length !== 2) {
			value = value.substring(0, 2);
		}

		return super.prepareValue(value);
	}

	protected validateValue (value: LangCode): void {
		if (!Lang.has(value)) {
			throw new UserError('The selected language is not supported');
		}

		super.validateValue(value);
	}

}