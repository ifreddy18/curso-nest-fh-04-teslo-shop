// Nest
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
// Libraries
import { Repository } from 'typeorm'
// External modules
import { EncryptAdapter } from 'src/common/adapters/encryp.adapter'
// This module
import { User } from './entities'
import { CreateUserDto, LoginUserDto } from './dto'
import { JwtPayload } from './interfaces'

@Injectable()
export class AuthService {
	private logger = new Logger('AuthService')

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
		private readonly encrypt: EncryptAdapter,
	) {}

	async create(createUserDto: CreateUserDto) {
		try {
			const { password, ...userData } = createUserDto

			const user = this.userRepository.create({
				...userData,
				password: this.encrypt.hashSync(password),
			})

			await this.userRepository.save(user)
			delete user.password

			return this.getUserWithToken(user)
		} catch (error) {
			this.handleDBError(error)
		}
	}

	async login(loginUserDto: LoginUserDto) {
		const { password, email } = loginUserDto

		const user = await this.userRepository.findOne({
			where: { email },
			select: { email: true, password: true, id: true },
		})

		if (!user)
			throw new UnauthorizedException('Credentials are not valid (email)')

		if (!this.encrypt.compareSync(password, user.password))
			throw new UnauthorizedException('Credentials are not valid (password)')

		return this.getUserWithToken(user)
	}

	async checkAuthStatus(user: User) {
		return this.getUserWithToken(user)
	}

	private getUserWithToken(user: User) {
		if (user.isActive) delete user.isActive
		return {
			...user,
			token: this.getJwtPayload({ id: user.id }),
		}
	}

	private getJwtPayload(payload: JwtPayload): string {
		const token = this.jwtService.sign(payload)
		return token
	}

	private handleDBError(error: any): never {
		if (error.code === '23505') throw new BadRequestException(error.detail)
		this.logger.error(error)
		throw new InternalServerErrorException('Check server logs')
	}
}
