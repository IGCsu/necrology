import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Snowflake } from 'discord-api-types/v6';
import { BaseModel } from './BaseModel';

@Entity()
export class Action extends BaseModel {

	@PrimaryGeneratedColumn()
	public id: number;

	@Column('int')
	public type: number;

	@Column('varchar')
	public guildId: Snowflake;

	@Column('varchar')
	public targetId: Snowflake;

	@Column('varchar')
	public executorId: Snowflake;

	@Column('varchar')
	public messageId: Snowflake;

	@Column('varchar')
	public threadId: Snowflake;

	@Column('text')
	public reason: string;

	@Column('bigint')
	public parentId: number;

	@Column('bigint')
	public timestamp: number;

}