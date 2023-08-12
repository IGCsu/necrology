import {
	ApplicationCommand,
	ApplicationCommandData,
	ApplicationCommandOptionData,
	ApplicationCommandType,
	PermissionFlagsBits,
	PermissionResolvable,
	PermissionsBitField
} from 'discord.js';
import { InteractionSession } from './Session/InteractionSession';
import { Lang, LangCode, LangKey } from './Lang';

export type CommandFunc = (s: InteractionSession) => Promise<void>;

/** Строковое выражение и описание команды */
export type InlineCommand = string;

export type CommandName = string;

export class Command {

	protected app!: ApplicationCommand;

	/** Функция-слушатель ивента */
	protected func!: CommandFunc;

	protected name: CommandName;

	protected desc!: LangKey;

	protected type: ApplicationCommandType = ApplicationCommandType.ChatInput;

	/** Права, необходимые для доступа к команде */
	protected perm: PermissionResolvable = PermissionsBitField.Flags.ManageGuild;

	protected options: ApplicationCommandOptionData[] = [];

	public constructor (name: CommandName, func: CommandFunc) {
		this.name = name;
		this.func = func;
	}

	public static create (name: CommandName, func: CommandFunc): Command {
		return new this(name, func);
	}

	public callFunc (s: InteractionSession): Promise<void> {
		return this.func(s);
	}

	public setFunc (func: CommandFunc): Command {
		this.func = func;
		return this;
	}

	public getDesc (): LangKey {
		return this.desc;
	}

	public setDesc (desc: LangKey): Command {
		this.desc = desc;
		return this;
	}

	public getApp (): ApplicationCommand {
		return this.app;
	}

	public setApp (app: ApplicationCommand): Command {
		this.app = app;
		return this;
	}

	public getType (): ApplicationCommandType {
		return this.type;
	}

	public setType (type: ApplicationCommandType): Command {
		this.type = type;
		return this;
	}

	public getPerm (): PermissionResolvable {
		return this.perm;
	}

	public setPerm (perm: PermissionResolvable): Command {
		this.perm = perm;
		return this;
	}

	public getOptions (): ApplicationCommandOptionData[] {
		return this.options;
	}

	public addOption (option: ApplicationCommandOptionData): Command {
		this.options.push(option);
		return this;
	}

	public addOptions (options: ApplicationCommandOptionData[]): Command {
		for (const option of options) {
			this.addOption(option);
		}

		return this;
	}

	public toDiscord (): ApplicationCommandData {
		const description = Lang.getText(this.desc);

		if (!description) {
			throw new ReferenceError(
				'Missing description of command "' + this.name + '" in default language'
			);
		}

		return {
			name: this.name,
			defaultMemberPermissions: this.perm,
			description: description,
			descriptionLocalizations: Lang.toDiscord(this.desc),
			type: this.type,
			options: this.options
		};
	}

	public toString (locale: LangCode = Lang.DEFAULT_LANG): InlineCommand {
		return '</' + this.name + ':' + this.app.id + '> - ' +
			Lang.getText(this.desc, locale);
	}

}