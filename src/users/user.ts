import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from '../orders/order'
import { Rating } from '../ratings/rating'

@ObjectType()
@Entity()
export class User {
	@PrimaryColumn()
	@Field(() => ID)
	id: string

	@Field(() => [Order])
	@OneToMany(() => Order, (o) => o.seller)
	selling: Order[]
@Field(() => [Order])
	@OneToMany(() => Order, (o) => o.buyer)
	buying: Order[]

	@Field()
	@Column()
	sellingRating: number

	@Field()
	@Column()
	buyingRating: number

	@Field(() => [Rating])
	@OneToMany(() => Rating, r => r.from)
	writtenRatings: Rating[]

	@Field(() => [Rating])
	@OneToMany(() => Rating, r => r.for)
	ratings: Rating[]

	@Field(() => [Order])
	@ManyToMany(() => Order, o => o.requests)
	requests: Order[]
}
