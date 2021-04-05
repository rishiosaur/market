import { User } from '../users/user'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum RatingType {
	Selling,
	Buying
}

registerEnumType(RatingType, {
	name: "RatingType"
})

@Entity()
@ObjectType()
export class Rating {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Field(() => User)
	@ManyToOne(() => User, u => u.writtenRatings)
	from: User

	@Field(() => User)
	@ManyToOne(() => User, u=> u.ratings)
	for: User

	@Field()
	@Column()
	description: string

	@Field()
	@CreateDateColumn()
	created: Date

	@Field()
	@Column()
	rating: number

	@Field(() => RatingType)
	@Column()
	type: RatingType
}
