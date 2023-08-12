import { LangKey } from '../Lang';
import { UserError } from '../Error/UserError';

/** Ключ конфига */
export type ConfigKey = string;

/** Значение конфига */
export type ConfigValue = any;

export abstract class ConfigElement {

	public abstract readonly key: ConfigKey;
	public abstract readonly name: LangKey;
	public abstract readonly desc: LangKey;

	protected value: ConfigValue;

	protected constructor (value: ConfigValue) {
		this.value = value;
	}

	public getValue (): ConfigValue {
		return this.value;
	}

	public setValue (value: ConfigValue) {
		value = this.prepareValue(value);

		this.validateValue(value);

		this.value = value;
	}

	/** Функция подготовки значения */
	protected prepareValue (value: ConfigValue): ConfigValue {
		return value;
	}

	/** Функция валидации значения */
	protected validateValue (value: ConfigValue): void {
		if (
			!value === undefined
			|| value === null
			|| (value && isNaN(value))
		) {
			throw new UserError('Value is invalid');
		}
	}

}