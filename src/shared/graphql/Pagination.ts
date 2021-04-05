import { Field, InputType, registerEnumType } from '@nestjs/graphql'

export enum SortOrder {
	Asc = "ASC",
	Desc = "DESC"
}

registerEnumType(SortOrder, {
	name: "SortOrder"
})

@InputType()
export class SortInput {
	@Field(() => SortOrder, {
		nullable: true,
	})
	order?: SortOrder

	@Field()
	field: string
}

@InputType()
export class PaginationInput {
	@Field({
		description: 'Amount of entries per page.',
		nullable: true,
	})
	take?: number

	@Field({
		description: 'Initial offset of page.',
		nullable: true,
	})
	skip?: number

	@Field({
		description: 'Page number.',
		nullable: true,
	})
	page?: number

	@Field({
		description: 'Sort by a given field.',
		nullable: true,
	})
	sort?: SortInput
}

export const mapPaginationToFindProps = (options: PaginationInput) => ({
	skip: options?.skip || (options?.take || 0) * (options?.page || 0),
	take: options?.take,
	...(options?.sort && {
		order: {
			[options?.sort.field]: options?.sort.order || 'ASC' as any,
		},
	}),
})
