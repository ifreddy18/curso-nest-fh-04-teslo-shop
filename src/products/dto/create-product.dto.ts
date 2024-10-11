import { ApiProperty } from '@nestjs/swagger'
import {
	IsArray,
	IsIn,
	IsInt,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MinLength,
} from 'class-validator'

export class CreateProductDto {
	@ApiProperty({
		description: 'Product title',
		nullable: false,
		minLength: 1,
	})
	@IsString()
	@MinLength(1)
	title: string

	@ApiProperty({
		description: 'Product title',
		nullable: true,
	})
	@IsNumber()
	@IsPositive()
	@IsOptional()
	price?: number

	@ApiProperty({
		description: 'Product description',
		nullable: true,
		minLength: 1,
	})
	@IsString()
	@IsOptional()
	description?: string

	@ApiProperty({
		description: 'Product slug',
		nullable: true,
		minLength: 1,
	})
	@IsString()
	@IsOptional()
	slug?: string

	@ApiProperty()
	@IsInt()
	@IsPositive()
	@IsOptional()
	stock?: number

	@ApiProperty()
	@IsString({ each: true })
	@IsArray()
	sizes: string[]

	@ApiProperty()
	@IsIn(['men', 'women', 'kid', 'unisex'])
	gender: string

	@ApiProperty()
	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	tags: string[]

	@ApiProperty()
	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	images?: string[]
}
