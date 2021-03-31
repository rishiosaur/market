import { Global, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { TypeOrmModule } from '@nestjs/typeorm'

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
		],
		controllers: [],
		providers: [],
	})
	abstract class BaseAppModule {}

	return BaseAppModule
}
