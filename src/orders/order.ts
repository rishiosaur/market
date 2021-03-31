import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import Collator = Intl.Collator
import { User } from '../users/user'

@Entity()
@ObjectType()
export class Order {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	id: string

	@Column()
	@Field()
	title: string

	@Column('int')
	@Field(() => Int)
	cost: number

	@Column({ default: false })
	@Field()
	approved: boolean

	@Field(() => User)
	@ManyToOne(() => User, (u) => u.selling)
	seller: User

	@Field(() => User, { nullable: true })
	@ManyToOne(() => User, (u) => u.buying)
	buyer: User
}
