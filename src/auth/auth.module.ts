import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { CommonModule } from 'src/common/common.module'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { User } from './entities'
import { JwtStrategy } from './strategies'

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	imports: [
		TypeOrmModule.forFeature([User]),

		PassportModule.register({ defaultStrategy: 'jwt' }),

		// JwtModule.register({
		// 	secret: process.env.JWT_SECRET,
		// 	signOptions: {
		// 		expiresIn: '2h',
		// 	},
		// }),

		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				// console.log(`JWT: ${configService.get('JWT_SECRET')}`)
				// console.log(`JWT: ${process.env.JWT_SECRET}`)
				return {
					secret: configService.get('JWT_SECRET'),
					signOptions: {
						expiresIn: '1h',
					},
				}
			},
		}),

		ConfigModule,
		CommonModule,
	],
	exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
