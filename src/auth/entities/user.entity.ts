import { Product } from 'src/products/entities'
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column('text', { unique: true })
	email: string

	@Column('text', { select: false })
	password: string

	@Column('text')
	fullName: string

	@Column('bool', { default: true })
	isActive: boolean

	@Column('text', { array: true, default: ['user'] })
	roles: string[]

	/* Relations */
	@OneToMany(() => Product, product => product.user)
	product: Product

	/* Functions */

	@BeforeInsert()
	checkFieldsBeforeInsert() {
		this.email = this.email.toLowerCase().trim()
		this.fullName = this.fullName.trim()
	}

	@BeforeUpdate()
	checkFieldsBeforeUpdate() {
		this.checkFieldsBeforeInsert()
	}
}
