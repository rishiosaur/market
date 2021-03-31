import { Module } from '@nestjs/common'
import { OrderService } from './service/order.service'
import { OrderResolver } from './resolver/order.resolver'

@Module({
	providers: [OrderService, OrderResolver],
})
export class OrdersModule {}
