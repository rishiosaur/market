import { Injectable } from '@nestjs/common'
import { BaseEntity, Repository } from 'typeorm'
import { BaseEntityService } from '../../shared/database'
import { Rating } from '../rating'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class RatingService extends BaseEntityService(Rating) {
	constructor(@InjectRepository(Rating) private ratings: Repository<Rating>) {
		super(ratings);
	}
}
