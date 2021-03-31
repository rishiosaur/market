import { Global, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { OrdersModule } from './orders/orders.module'
import { RatingsModule } from './ratings/ratings.module'

export const AppModule = (dbURL: string): any => {
	@Global()
	@Module({
		imports: [
			TypeOrmModule.forRoot({
				type: 'postgres',
				url: dbURL,
				entities: [],
				synchronize: true,
			}),
			GraphQLModule.forRoot({
				playground: true,

				introspection: true,
				autoSchemaFile: join(process.cwd() + 'src/schema.gql'),
				sortSchema: true,
			}),
			UsersModule,
			OrdersModule,
			RatingsModule,
		],
		controllers: [],
		providers: [],
	})
	abstract class BaseAppModule {}

	return BaseAppModule
}
