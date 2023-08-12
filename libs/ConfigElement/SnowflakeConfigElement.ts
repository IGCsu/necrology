import { ConfigElement, ConfigValue } from './ConfigElement';
import { UserError } from '../Error/UserError';
import { Snowflake } from 'discord-api-types/v6';

export abstract class SnowflakeConfigElement extends ConfigElement {

	public getValue (): Snowflake | null {
		return super.getValue() ?? null;
	}

	protected prepareValue (value: ConfigValue): ConfigValue {
		value = String(value);

		return super.prepareValue(value);
	}

	protected validateValue (value: ConfigValue): void {
		if (/\D/.test(value)) {
			throw new UserError('Snowflake is not valid');
		}

		super.validateValue(value);
	}

}