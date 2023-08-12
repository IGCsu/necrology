import { BaseEntity, SaveOptions } from 'typeorm';
import { Logger } from '../../libs/Logger';

export class BaseModel extends BaseEntity {

	public silentSave (options?: SaveOptions): void {
		super.save(options)
			.then(r => {
				Logger.info(r, options, Logger.SQL_PREFIX);
			})
			.catch(e => {
				Logger.error(e, options, Logger.SQL_PREFIX);
			});
	}

}