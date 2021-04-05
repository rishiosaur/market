import { Module } from '@nestjs/common'
import { RatingService } from './service/rating.service'
import { RatingResolver } from './resolver/rating.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Rating } from './rating'

@Module({
	providers: [RatingService, RatingResolver],
	imports: [
		TypeOrmModule.forFeature([
			Rating
		])
	]
})
export class RatingsModule {}
