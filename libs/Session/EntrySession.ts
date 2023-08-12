import { Session } from './Session';
import { Config } from '../../mvc/models/Config';
import { Guild, GuildAuditLogsEntry, GuildBasedChannel, GuildMember, Message, ThreadChannel } from 'discord.js';

export class EntrySession extends Session {

	/** Предыдущее значение таймаута */
	public oldTimeout: Date;

	/** Новое значение таймаута */
	public newTimeout: Date;

	/** Разница во времени в строковом формате */
	public diffTime: string;

	protected logChannel!: GuildBasedChannel | null;
	protected targetMember!: GuildMember | null;
	protected executorMember!: GuildMember | null;

	public message: Message;
	public thread: ThreadChannel;

	public constructor (
		public readonly entry: GuildAuditLogsEntry,
		guild: Guild,
		config: Config
	) {
		super(guild, config);

		this.entry = entry;
	}

	async getTargetMember (): Promise<GuildMember | null> {
		if (!this.entry.targetId) {
			return null;
		}

		if (!this.targetMember) {
			this.targetMember = await this.guild.members.fetch(this.entry.targetId);
		}

		return this.targetMember;
	}

	async getExecutorMember (): Promise<GuildMember | null> {
		if (!this.entry.executorId) {
			return null;
		}

		if (!this.executorMember) {
			this.executorMember = await this.guild.members.fetch(this.entry.executorId);
		}

		return this.executorMember;
	}

	async getLogChannel (): Promise<GuildBasedChannel | null> {
		const logChannelId = this.config.getChannelId().getValue();

		if (!logChannelId) {
			return null;
		}

		if (!this.executorMember) {
			this.logChannel = await this.guild.channels.fetch(logChannelId);
		}

		return this.logChannel;
	}

}