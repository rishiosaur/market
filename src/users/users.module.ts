import { Module } from '@nestjs/common'
import { UserService } from './service/user.service'
import { UserResolver } from './resolver/user.resolver'

@Module({
	providers: [UserService, UserResolver],
})
export class UsersModule {}
