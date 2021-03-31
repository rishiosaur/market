import { Module } from '@nestjs/common'
import { RatingService } from './service/rating.service'
import { RatingResolver } from './resolver/rating.resolver'

@Module({
	providers: [RatingService, RatingResolver],
})
export class RatingsModule {}
