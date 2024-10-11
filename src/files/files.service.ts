// Node
import { join } from 'path'
import { existsSync } from 'fs'
// Nest
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FilesService {
	constructor(private readonly configService: ConfigService) {}

	getStaticProductImage(imageName: string) {
		const path = join(__dirname, '../../static/products', imageName)

		if (!existsSync(path))
			throw new BadRequestException(`No product found with image ${imageName}`)

		return path
	}

	getSecureUrl(file: Express.Multer.File) {
		if (!file)
			throw new BadRequestException('Make sure that the file is an image')

		const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

		return { secureUrl }
	}
}
