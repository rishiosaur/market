import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import Collator = Intl.Collator
import { User } from '../users/user'

@ObjectType()
class OrderRequest {
	@Field()
	id: string

	@Field()
	tz: string
}

@Entity()
@ObjectType()
export class Order {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	id: string

	@Column()
	@Field()
	title: string

	@Column()
	@Field()
	description: string

	@Column('int')
	@Field(() => Int)
	cost: number

	@Column({ default: false })
	@Field()
	approved: boolean

	@Column({ default: false })
	@Field()
	paid: boolean

	@Field(() => User)
	@ManyToOne(() => User, (u) => u.selling)
	seller: User

	@Field(() => User, { nullable: true })
	@ManyToOne(() => User, (u) => u.buying)
	buyer: User

	@Field(() => [User])
	@ManyToMany(() => User, u => u.requests)
	@JoinTable({
		joinColumn: {
			name:"order_id",

		},
		inverseJoinColumn: {
			name: "buyer_id"
		}
	})
	requests: User[]

	@Field(() => Date)
	@CreateDateColumn()
	created: Date

	@Field(() => [OrderRequest])
	@Column({ type: "jsonb", nullable: true  })
	requestTZs: { id: string, tz: string }[] = []

	@Field()
	@Column({ default: "" })
	reviewTZ: string

}
