import { join } from 'path'

import { ServeStaticModule } from '@nestjs/serve-static'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { JoiValidationSchema } from './config'
import { ProductsModule } from './products/products.module'
import { CommonModule } from './common/common.module'
import { SeedModule } from './seed/seed.module'
import { FilesModule } from './files/files.module'
import { AuthModule } from './auth/auth.module'
import { MessagesWsModule } from './messages-ws/messages-ws.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			// load: [EnvConfiguration],
			validationSchema: JoiValidationSchema,
		}),

		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			database: process.env.DB_NAME,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			autoLoadEntities: true,
			synchronize: true, // Debe ser false para prod, sync modificaciones en db
		}),

		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public'),
		}),

		ProductsModule,

		CommonModule,

		SeedModule,

		FilesModule,

		AuthModule,

		MessagesWsModule,
	],
})
export class AppModule {}
