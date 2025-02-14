import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Observable } from 'rxjs'

import { META_ROLES } from 'src/auth/decorators'
import { User } from 'src/auth/entities'

@Injectable()
export class UserRoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest()
		const user = req.user as User

		if (!user) throw new BadRequestException('User not found')

		const validRoles: string[] = this.reflector.get(
			META_ROLES,
			context.getHandler(),
		)

		// En caso que no tenga la metadata, se permite el acceso
		if (!validRoles || validRoles.length === 0) return true

		for (const role of user.roles) if (validRoles.includes(role)) return true

		throw new ForbiddenException(
			`User ${user.fullName} need a valid role. Valid roles: [${validRoles}]`,
		)
	}
}
