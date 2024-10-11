import { UseGuards, applyDecorators } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { ValidRoles } from '../interfaces'
import { UserRoleGuard } from '../guards'

import { RoleProtected } from './role-protected.decorator'

export function Auth(...roles: ValidRoles[]) {
	return applyDecorators(
		RoleProtected(...roles), // Authorization
		UseGuards(
			AuthGuard(), // Authentication
			UserRoleGuard, // Authorization
		),
	)
}
