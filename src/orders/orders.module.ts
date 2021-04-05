import { Module } from '@nestjs/common'
import { OrderService } from './service/order.service'
import { OrderFieldResolver, OrderResolver } from './resolver/order.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/user'
import { Order } from './order'

@Module({
	providers: [OrderService, OrderResolver, OrderFieldResolver],
	imports: [
		TypeOrmModule.forFeature([
			User,
			Order,
		])
	]
})
export class OrdersModule {}
