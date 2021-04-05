import { Args, Field, ID, InputType, Int, Mutation, ResolveField, Resolver, Root } from '@nestjs/graphql'
import { BaseEntityResolver } from '../../shared/graphql'
import { UserService, CreateRatingInput as ICreateRatingInput } from '../service/user.service'
import { User } from '../user'
import { Rating, RatingType } from '../../ratings/rating'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from '../../orders/order'

@InputType()
class CreateRatingInput implements ICreateRatingInput {
	@Field()
	description: string
	@Field()
	for: string
	@Field()
	from: string
	@Field(() => Int)
	rating: number
	@Field(() => RatingType)
	type: RatingType
}

@Resolver()
export class UserResolver extends BaseEntityResolver(User) {
	constructor(private service: UserService) {
		super(service)
	}

	@Mutation(() => User)
	createUser(@Args("id", {type: () => ID}) id: string) {
		return this.service.createUser(id)
	}

	@Mutation(() => User)
	addRating(@Args("object") object: CreateRatingInput) {
		console.log(object.rating)
		return this.service.addRating(object)
	}
}
@Resolver(of => User)

export class UserFieldResolver {
	constructor(@InjectRepository(Rating) private ratingsRepo: Repository<Rating>, @InjectRepository(User)private userRepo: Repository<User>, @InjectRepository(Order) private orders: Repository<Order>) {
	}

	@ResolveField(() => [Rating])
	async ratings(@Root() user: User) {
		if (user.ratings) {
			return user.ratings
		}

		const { ratings } = await this.userRepo.findOneOrFail(user.id, {
			relations: ["ratings"]
		})

		return ratings
	}

	@ResolveField(() => [Order])
	async selling(@Root() user: User) {
		if (user.selling) {
			return user.selling
		}

		const { selling } = await this.userRepo.findOneOrFail(user.id, {
			relations: ["selling"]
		})

		return selling
	}

	@ResolveField(() => [Order])
	async buying(@Root() user: User) {
		if (user.buying) {
			return user.buying
		}

		const { buying }  = await this.userRepo.findOneOrFail(user.id, {
			relations: ["buying"]
		})

		return buying
	}
}
