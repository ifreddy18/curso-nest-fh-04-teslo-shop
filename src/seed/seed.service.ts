import { Injectable } from '@nestjs/common'
import { ProductsService } from 'src/products/products.service'
import { initialData } from './data/seed-data'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/entities'
import { Repository } from 'typeorm'
import { EncryptAdapter } from 'src/common/adapters/encryp.adapter'

@Injectable()
export class SeedService {
	constructor(
		private readonly productService: ProductsService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly encrypt: EncryptAdapter,
	) {}

	async executeSeed() {
		await this.deleteTables()
		const user = await this.insertUsers()
		await this.insertNewProducts(user)
		return 'Seed executed'
	}

	private async deleteTables() {
		// Delete old data
		await this.productService.deleteAllProducts()

		const queryBuilder = this.userRepository.createQueryBuilder()
		// Delete users table content
		await queryBuilder.delete().where({}).execute()
	}

	private async insertUsers(): Promise<User> {
		const seedUsers = initialData.users
		const users: User[] = []

		// seedUsers.forEach(user => users.push(this.userRepository.create(user)))
		seedUsers.forEach(user =>
			users.push(
				this.userRepository.create({
					...user,
					password: this.encrypt.hashSync(user.password),
				}),
			),
		)
		const savedUsers = await this.userRepository.save(users)

		return savedUsers[0] // First user
	}

	private async insertNewProducts(user: User) {
		// Insert new data
		const products = initialData.products
		const insertPromises = []

		products.forEach(product => {
			insertPromises.push(this.productService.create(product, user))
		})

		await Promise.all(insertPromises)
	}
}
