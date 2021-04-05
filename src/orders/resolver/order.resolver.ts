import { Args, Field, ID, InputType, Mutation, ResolveField, Resolver, Root } from '@nestjs/graphql'
import { BaseEntityResolver } from '../../shared/graphql'
import { OrderService, CreateOrderInput as ICreateOrderInput, UpdateOrderInput as IUpdateOrderInput } from '../service/order.service'
import { Order } from '../order'
import { User } from '../../users/user'
import { InjectRepository } from '@nestjs/typeorm'
import { Rating } from '../../ratings/rating'
import { Repository } from 'typeorm'

@InputType()
class CreateOrderInput implements ICreateOrderInput {

	@Field()
	cost: number
	@Field()
	description: string
	@Field()
	seller: string
	@Field()
	title: string
}

@InputType()
class UpdateOrderInput implements IUpdateOrderInput {
	@Field()
	description: string
	@Field()
	title: string
}

@Resolver()
export class OrderResolver extends BaseEntityResolver(Order) {
	constructor(private orders: OrderService) {
		super(orders);
	}

	@Mutation(() => Order)
	createOrder(@Args("object") object: CreateOrderInput) {
		return this.orders.createOrder(object)
	}

	@Mutation(() => Order)
	addReviewTZ(@Args("id", { type: () => ID}) id: string, @Args("tz") tz: string) {
		return this.orders.addReviewTZ(id, tz)
	}

	@Mutation(() => Order)
	updateOrder(@Args("order", { type: () => ID }) id: string, @Args("object") object: UpdateOrderInput) {
		return this.orders.updateOrder(id, object)
	}

	@Mutation(() => Order)
	public async approveOrder(@Args("order", { type: () => ID }) id: string) {
		return this.orders.approveOrder(id)
	}
@Mutation(() => Order)
	public async rejectOrder(@Args("order", { type: () => ID }) id: string) {
		return this.orders.rejectOrder(id)
	}@Mutation(() => Order)
	public async requestPurchase(@Args("user", { type: () => ID }) user: string, @Args("order", { type: () => ID }) order: string, @Args("tz") tz: string) {
		return this.orders.requestPurchase(user, order, tz)
	}@Mutation(() => Order)
		public async removePurchaseRequest(@Args("user", { type: () => ID }) user: string, @Args("order", { type: () => ID }) order: string) {
		return this.orders.removePurchaseRequest(user, order)
		}@Mutation(() => Order)
			public async rejectPurchaseRequest(@Args("user", { type: () => ID }) user: string,@Args("order", { type: () => ID })  order: string) {
		return this.orders.rejectPurchaseRequest(user, order)
			}@Mutation(() => Order)
			public async approvePurchaseRequest(@Args("user", { type: () => ID }) user: string, @Args("order", { type: () => ID }) order: string) {
		return this.orders.approvePurchaseRequest(user, order)
			}@Mutation(() => String)
				public async generateInvoice(@Args("order", { type: () => ID }) order: string) {
		return this.orders.generateInvoice(order)
				}
}


@Resolver(of => Order)
export class OrderFieldResolver {
	constructor( @InjectRepository(User)private userRepo: Repository<User>, @InjectRepository(Order) private orders: Repository<Order>) {
	}

	@ResolveField(() => User)
	async seller(@Root() order: Order) {
		if (order.seller) {
			return order.seller
		}

		const { seller } = await this.orders.findOneOrFail(order.id, {
			relations: ["seller"]
		})

		return seller
	}

	@ResolveField(() => [User])
	async requests(@Root() order: Order) {
		if (order.requests) {
			return order.requests
		}

		const { requests } = await this.orders.findOneOrFail(order.id, {
			relations: ["requests"]
		})

		return requests
	}



}
