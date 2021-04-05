import { Resolver } from '@nestjs/graphql'
import { BaseEntityResolver } from '../../shared/graphql'
import { Rating } from '../rating'
import { RatingService } from '../service/rating.service'

@Resolver()
export class RatingResolver extends BaseEntityResolver(Rating) {
	constructor(private ratings: RatingService) {
		super(ratings);

	}
}
