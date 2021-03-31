import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from '../orders/order'

@ObjectType()
@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	id: string

	@OneToMany(() => Order, (o) => o.seller)
	selling: Order[]

	@OneToMany(() => Order, (o) => o.buyer)
	buying: Order[]

	@Field()
	@Column()
	sellingRating: number

	@Field()
	@Column()
	buyingRating: number
}
