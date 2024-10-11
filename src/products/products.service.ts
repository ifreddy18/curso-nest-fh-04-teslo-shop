import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, QueryRunner, Repository } from 'typeorm'
import { Product, ProductImage } from './entities'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { validate as isUUID } from 'uuid'
import { User } from 'src/auth/entities'

@Injectable()
export class ProductsService {
	private readonly logger = new Logger('ProductService')

	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		@InjectRepository(ProductImage)
		private readonly productImageRepository: Repository<ProductImage>,
		private readonly dataSource: DataSource,
	) {}

	async create(createProductDto: CreateProductDto, user: User) {
		try {
			const { images = [], ...productDetail } = createProductDto

			const product = this.productRepository.create({
				...productDetail,
				user,
				images: images.map(image =>
					this.productImageRepository.create({ url: image }),
				),
			})
			await this.productRepository.save(product)
			return { ...product, images }
		} catch (error) {
			this.handleDBExceptions(error)
		}
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit = 10, offset = 0 } = paginationDto
		try {
			const products = await this.productRepository.find({
				take: limit,
				skip: offset,
				relations: { images: true },
			})

			return products.map(product => this.getPlainProduct(product))
		} catch (error) {
			this.handleDBExceptions(error)
		}
	}

	private async findOne(term: string) {
		let product: Product

		try {
			if (isUUID(term)) {
				product = await this.productRepository.findOneBy({ id: term })
			} else {
				const queryBuilder = this.productRepository.createQueryBuilder('prod')
				// SELECT * FROM products prod WHERE prod.slug='X' OR prod.title='X'
				product = await queryBuilder
					.where('UPPER(title) = :title OR slug = :slug', {
						title: term.toUpperCase(),
						slug: term.toLowerCase(),
					})
					.leftJoinAndSelect('prod.images', 'prodImages')
					.getOne()
			}
			if (!product)
				throw new NotFoundException(
					`Product with id/slug/title '${term}' not found`,
				)

			return product
		} catch (error) {
			this.handleDBExceptions(error)
		}
	}

	async findOnePlain(term: string) {
		const product = await this.findOne(term)
		return this.getPlainProduct(product)
	}

	async update(id: string, updateProductDto: UpdateProductDto, user: User) {
		const { images, ...productDetail } = updateProductDto
		let queryRunner: QueryRunner

		console.log({ user })

		try {
			// preload: search for id and preload the fields in updateProductDto
			const product = await this.productRepository.preload({
				id,
				...productDetail,
				user,
			})

			if (!product)
				throw new NotFoundException(`Product with id '${id}' not found`)

			// Create Query Runner
			queryRunner = this.dataSource.createQueryRunner()
			await queryRunner.connect()
			await queryRunner.startTransaction()

			/*
				Cuando se usa el queryTunner.manager no esta impactando la base de datos
				en ese instante
			*/
			if (images) {
				// Se eliminan todas las imagenes existentes
				await queryRunner.manager.delete(ProductImage, { product: { id } })
				product.images = images.map(image =>
					this.productImageRepository.create({ url: image }),
				)
			}

			await queryRunner.manager.save(product)
			// await this.productRepository.save(product)

			await queryRunner.commitTransaction()
			await queryRunner.release()

			// Se consulta la DB para obtener las imagenes solo en caso de que el
			// usuario no las modificara
			const updatedProduct = images
				? this.getPlainProduct(product)
				: await this.findOnePlain(id)

			return updatedProduct
		} catch (error) {
			// Si alguna transaccion falla, se hace rollback
			if (queryRunner) await queryRunner.rollbackTransaction()
			this.handleDBExceptions(error)
		}
	}

	async remove(id: string) {
		const product = await this.findOne(id)
		await this.productRepository.remove(product)
	}

	private handleDBExceptions(error: any) {
		if (error.code === '23505') throw new BadRequestException(error.detail)
		this.logger.error(error)
		throw new InternalServerErrorException('Unexpected error - Check logs')
	}

	getPlainProduct(product: Product) {
		return {
			...product,
			images: product.images.map(image => image.url),
		}
	}

	/**
	 * For delete all products in DB (not allowed in production)
	 */
	async deleteAllProducts() {
		const query = this.productRepository.createQueryBuilder('product')

		try {
			return await query.delete().where({}).execute()
		} catch (error) {
			this.handleDBExceptions(error)
		}
	}
}
