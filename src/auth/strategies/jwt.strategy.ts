import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'

import { JwtPayload } from '../interfaces'
import { User } from '../entities'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		configService: ConfigService,
	) {
		super({
			secretOrKey: configService.get('JWT_SECRET'),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		})
	}

	// Se encarga de suministrar el usuario despues de obtener su id del token
	async validate(payload: JwtPayload): Promise<User> {
		const { id } = payload

		console.log({ id, payload })

		const user = await this.userRepository.findOneBy({ id })

		if (!user) throw new UnauthorizedException('Token not valid')
		if (!user.isActive) throw new UnauthorizedException('User inactive')

		return user
	}
}
