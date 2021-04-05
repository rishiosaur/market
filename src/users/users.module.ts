import { Module } from '@nestjs/common'
import { UserService } from './service/user.service'
import { UserFieldResolver, UserResolver } from './resolver/user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user'
import { Rating } from '../ratings/rating'
import { Order } from '../orders/order'

@Module({
	providers: [UserService, UserResolver, UserFieldResolver],
	imports: [
		TypeOrmModule.forFeature([
			User,
			Rating,
			Order
		])
	]
})
export class UsersModule {}
