import {
	Controller,
	Post,
	Body,
	UseGuards,
	Get,
	Headers,
	Req,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'

import { RawHeaders } from 'src/common/decorators'

import { AuthService } from './auth.service'
import { CreateUserDto, LoginUserDto } from './dto'
import { User } from './entities'
import { Auth, GetUser, RoleProtected } from './decorators'
import { IncomingHttpHeaders } from 'http'
import { UserRoleGuard } from './guards'
import { ValidRoles } from './interfaces'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	create(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto)
	}

	@Post('login')
	login(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto)
	}

	@Get('/check-status')
	@Auth()
	checkAuthStatus(@GetUser() user: User) {
		return this.authService.checkAuthStatus(user)
	}

	@Get('private/1')
	@UseGuards(AuthGuard())
	testingPrivateRoute1(@Req() request: Express.Request) {
		return {
			ok: true,
			message: 'Hi! Private route 1',
			user: request.user,
		}
	}

	// Custom decorators for props
	@Get('private/2')
	@UseGuards(AuthGuard())
	testingPrivateRoute2(
		@GetUser() user: User,
		@GetUser('email') userEmail: string,
		@RawHeaders() rawHeaders: string[],
		@Headers() headers: IncomingHttpHeaders,
	) {
		return {
			ok: true,
			message: 'Hi! Private route 2',
			user,
			userEmail,
			rawHeaders,
			headers,
		}
	}

	@Get('private/3')
	// @SetMetadata('roles', ['admin', 'super-user']) // -> Replaced by @RoleProtected
	@RoleProtected(ValidRoles.admin, ValidRoles.superUser)
	@UseGuards(AuthGuard(), UserRoleGuard)
	testingPrivateRoute3(@GetUser() user: User) {
		return {
			ok: true,
			message: 'Hi! Private route 3',
			user,
		}
	}

	@Get('private/4')
	@Auth(ValidRoles.superUser, ValidRoles.admin) // -> Replace all decorators
	testingPrivateRoute4(@GetUser() user: User) {
		return {
			ok: true,
			message: 'Hi! Private route 4',
			user,
		}
	}
}
