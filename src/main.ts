import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { INestApplication } from '@nestjs/common'
import * as dotenv from 'dotenv'

export class App {
	private app: INestApplication

	constructor(private dbURL: string) {}

	public async bootstrap(port?: number) {
		const app = await NestFactory.create(AppModule(this.dbURL))
		await app.listen(port ?? 3000)
		this.app = app
	}
}

;(async () => {
	dotenv.config()
	const instance = new App(process.env.db)
	await instance.bootstrap(3000)
})()
