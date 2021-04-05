import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../users/user'
import { Repository } from 'typeorm'
import { Order } from '../order'
import request, { gql } from 'graphql-request'
import { BaseEntityService } from '../../shared/database'

export interface CreateOrderInput {
	title: string
	description: string
	cost: number
	seller: string
}

export interface UpdateOrderInput {
	title: string
	description: string
}

@Injectable()
export class OrderService extends BaseEntityService(Order) {
	constructor(@InjectRepository(User) private users: Repository<User>, @InjectRepository(Order) private orders: Repository<Order>) {
		super(orders)
	}
	public async createOrder(object: CreateOrderInput) {
		const seller  = await this.users.findOneOrFail(object.seller, { relations: ['selling'] })
		const order = await this.orders.create()
		Object.assign(order, {
			...object,
			approved: false,
			paid: false,
			seller
		})
		await this.orders.save(order)
		return order
	}

	public async addReviewTZ(id: string, tz: string) {
		const order = await this.orders.findOneOrFail(id)
		order.reviewTZ = tz
		await this.orders.save(order)
		return order
	}

	public async updateOrder(order: string, object: UpdateOrderInput) {
		return this.orders.update(order, object)
	}

	public async approveOrder(id: string) {
		const order = await this.orders.findOneOrFail(id)
		order.approved = true
		await this.orders.save(order)
		// http logic with bot
		return order
	}

	public async rejectOrder(id: string) {
		const order = await this.orders.findOneOrFail(id)
		order.approved = false
		await this.orders.save(order)
		// http logic with bot
		return order
	}

	// Adds a purchase request to be approved for the seller. if approved, `buyer` gets changed to this
	public async requestPurchase(user: string, order: string, tz: string) {
		const orderEntity = await this.orders.findOneOrFail(order, { relations: ["requests"] })
		const userEntity = await this.users.findOneOrFail(user, { relations: ['requests'] })
		if (orderEntity.requests.includes(userEntity) || userEntity.requests.includes(orderEntity)) {
			throw new Error(`User with ID ${user} has already requested a purchase for Order with ID ${orderEntity}.`)
		}

		orderEntity.requests.push(userEntity)
		console.log(orderEntity.requestTZs)
		orderEntity.requestTZs.push({
			id: user,
			tz
		})
		await this.orders.save(orderEntity)

		userEntity.requests.push(orderEntity)
		await this.users.save(userEntity)

		// HTTP resolution

		return orderEntity
	}

	// Buyer-side
	public async removePurchaseRequest(user: string, order: string) {
		const orderEntity = await this.orders.findOneOrFail(order, { relations: ["requests"] })
		const userEntity = await this.users.findOneOrFail(user, { relations: ['requests'] })

		if (!orderEntity.requests.map(z => z.id).includes(user) || !userEntity.requests.map(z => z.id).includes(order)) {
			throw new Error(`Order with ID ${order} does not have a request for purchase from user ${user}.`)
		}

		orderEntity.requests = orderEntity.requests.filter(z => z.id !== user)

		await this.orders.save(orderEntity)
		// HTTP resolution
		return orderEntity
	}


	// Removes request from array (cascading entries), sends dm to buyer -
	public async rejectPurchaseRequest(user: string, order: string) {

		const orderEntity = await this.orders.findOneOrFail(order, { relations: ["requests"] })
		const userEntity = await this.users.findOneOrFail(user, { relations: ['requests'] })

		console.log(orderEntity.requests.map(z => z.id))

		if (!orderEntity.requests.map(z => z.id).includes(user) || !userEntity.requests.map(z => z.id).includes(order)) {
			throw new Error(`Order with ID ${order} does not have a request for purchase from user ${user}.`)
		}

		orderEntity.requests = orderEntity.requests.filter(z => z.id !== user)

		await this.orders.save(orderEntity)

		// HTTP Resolution

		return orderEntity
	}


	// approves request, generates invoice, sends to both parties
	public async approvePurchaseRequest(user: string, order: string) {
		const orderEntity = await this.orders.findOneOrFail(order, { relations: ["requests"] })
		const userEntity = await this.users.findOneOrFail(user, { relations: ['requests', 'buying'] })

		console.log(orderEntity.requests)
		console.log(userEntity.requests)

		if (!orderEntity.requests?.map(z => z.id).includes(user) || !userEntity.requests?.map(z => z.id).includes(order)) {
			throw new Error(`Order with ID ${order} does not have a request for purchase from user ${user}.`)
		}

		orderEntity.buyer = userEntity
		userEntity.buying.push(orderEntity)

		await this.orders.save(orderEntity)
		await this.users.save(userEntity)

		//HTTP reolution

		return orderEntity
	}

	// Creates the HN unvalidated transaction from an order
	public async generateInvoice(order: string) {
		const orderEntity = await this.orders.findOneOrFail(order, { relations: ["seller", "buyer" as keyof Order] })
		if (!orderEntity.buyer) {
			throw new Error(`Order ${order} does not have a buyer.`)
		}
		const document = gql`
        mutation GenInvoice($seller:String!,$buyer:String!,$balance:Float!, $for:String!) {
            transact(data:{
                from:$seller,
                to:$buyer,
                balance:$balance,
                for:$for
            }) {
                id
            }
        }
		`

		const { transact: { id } } = await request(process.env.hn, document, {
			seller: orderEntity.seller.id,
			buyer: orderEntity.buyer.id,
			balance: orderEntity.cost,
			for: `Buying the Order named "${orderEntity.title}"`
		})

		return id
	}

}
