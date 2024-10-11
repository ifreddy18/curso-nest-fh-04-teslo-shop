import { ApiProperty } from '@nestjs/swagger'

import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from 'src/auth/entities'
import { ProductImage } from './'

@Entity({ name: 'products' })
export class Product {
	/* Columns */

	@ApiProperty({
		example: '29929b8f-95a7-425d-9830-3720bb3b851b',
		description: 'Product ID',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn('uuid')
	id: string

	@ApiProperty({
		example: '3D Large Wordmark Pullover Hoodie',
		description: 'Product Title',
		uniqueItems: true,
	})
	@Column('text', { unique: true })
	title: string

	@ApiProperty({
		example: 4.99,
		description: 'Product PRice',
	})
	@Column('float', { default: 0 })
	price: number

	@ApiProperty({
		example:
			'The Unisex 3D Large Wordmark Pullover Hoodie features soft fleece and an adjustable, jersey-lined hood for comfort and coverage. Designed in a unisex style, the pullover hoodie includes a tone-on-tone 3D silicone-printed wordmark across the chest.',
		description: 'Product Description',
		default: null,
	})
	@Column({ type: 'text', nullable: true })
	description?: string

	@ApiProperty({
		example: '3d_large_wordmark_pullover_hoodie',
		description: 'Product Slug - For SEO',
		uniqueItems: true,
	})
	@Column('text', { unique: true })
	slug: string

	@ApiProperty({
		example: 4,
		description: 'Product Stock',
		default: 0,
	})
	@Column('int', { default: 0 })
	stock: number

	@ApiProperty({
		example: ['S', 'M', 'L', 'XL'],
		description: 'Product size',
	})
	@Column('text', { array: true })
	sizes: string[]

	@ApiProperty()
	@Column('text')
	gender: string

	@ApiProperty()
	@Column('text', { array: true, default: [] })
	tags: string[]

	/* Relations */
	@ApiProperty()
	@OneToMany(() => ProductImage, productImage => productImage.product, {
		cascade: true,
		eager: true, // Para cargar ProductImage cuando se busque (find) un Product
	})
	images?: ProductImage[]

	@ManyToOne(() => User, user => user.product, { eager: true })
	user: User

	/* Functions */

	@BeforeInsert()
	checkSlugInsert() {
		if (!this.slug) this.slug = this.title
		this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
	}

	@BeforeUpdate()
	checkSlugUpdate() {
		this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
	}
}
