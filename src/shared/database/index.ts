import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'

export interface IBaseEntityService<Entity, InputType> {
	find(id: string, options?: FindOneOptions): Promise<Entity>
	findMany(options?: FindManyOptions): Promise<Entity[]>
	findByIDs(ids: string[], options?: FindManyOptions): Promise<Entity[]>
}

export const BaseEntityService = <Entity>(entity: Entity): any => {
	abstract class BaseEntityServiceHost
		implements Partial<IBaseEntityService<Entity, any>> {
		constructor(private repository: Repository<Entity>) {}

		find(id: string, options?: FindOneOptions<Entity>): Promise<Entity> {
			return this.repository.findOneOrFail(id, options)
		}

		findByIDs(
			ids: string[],
			options?: FindManyOptions<Entity>
		): Promise<Entity[]> {
			return this.repository.findByIds(ids, options)
		}

		findMany(options?: FindManyOptions<Entity> ): Promise<Entity[]> {
			return this.repository.find(options)
		}
	}

	return BaseEntityServiceHost
}
