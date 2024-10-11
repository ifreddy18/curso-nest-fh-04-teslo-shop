import { ApiProperty } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator'

export class PaginationDto {
	@ApiProperty({
		default: 10,
		description: 'How many results do you want',
	})
	@IsOptional()
	@IsNumber()
	@IsPositive()
	@Type(() => Number) // enableImplicitConversions: true
	limit?: number

	@ApiProperty({
		default: 0,
		description: 'How many results do you want to skip',
	})
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Type(() => Number) // enableImplicitConversions: true
	offset?: number
}
