import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../user'
import { Repository } from 'typeorm'
import { Rating, RatingType } from '../../ratings/rating'
import { BaseEntityService } from '../../shared/database'

export interface CreateRatingInput {
	from: string
	for: string
	type: RatingType
	description: string
	rating: number
}

@Injectable()
export class UserService extends BaseEntityService(User){

	constructor(@InjectRepository(User) private users: Repository<User>, @InjectRepository(Rating) private ratings: Repository<Rating>) {
		super(users)
	}

	public async createUser(id: string) {
		if (await this.users.findOne(id)) {
			throw new Error(`User with id ${id} already exists.`)
		}
		const user = await this.users.create()
		user.id = id
		user.buying = []
		user.selling = []
		user.requests = []
		user.buyingRating = 0
		user.sellingRating=  0
		await this.users.save(user)
		return user
	}

	public async addRating(object: CreateRatingInput) {
		const rating = await this.ratings.create()
		const from = await this.users.findOneOrFail(object.from, { relations: ["writtenRatings" as keyof User] })
		const ratingFor = await this.users.findOneOrFail(object.for, { relations: ["writtenRatings", 'ratings' as keyof User] })

		rating.from = from
		rating.for = ratingFor
		rating.type = object.type
		rating.description = object.description
		rating.rating = object.rating

		await this.ratings.save(rating)

		from.writtenRatings.push(rating)

		const key = object.type === RatingType.Buying ? "buyingRating" : "sellingRating"

		ratingFor[key] = Math.round(((ratingFor[key] * ratingFor.ratings.length) + object.rating) / (ratingFor.ratings.length + 1))

		ratingFor.ratings.push(rating)

		await this.users.save([from, ratingFor])

		return ratingFor
	}
}
