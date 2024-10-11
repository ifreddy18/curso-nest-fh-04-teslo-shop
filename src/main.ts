import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const prefix = 'api'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const logger = new Logger('Bootstrap')

	app.setGlobalPrefix(prefix)

	// Pipes
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	)

	// Swagger
	const config = new DocumentBuilder()
		.setTitle('Teslo RESTFul API')
		.setDescription('Teslo shop endpoints')
		.setVersion('1.0')
		// .addTag('products')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup(prefix, app, document)

	// Port
	const port = process.env.PORT
	await app.listen(port)
	logger.log(`App running in port: ${port}`)
}
bootstrap()
