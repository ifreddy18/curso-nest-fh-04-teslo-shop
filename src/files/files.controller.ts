import {
	Controller,
	Get,
	Param,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { diskStorage } from 'multer'
import { Response } from 'express'

import { FilesService } from './files.service'
import { fileFilter, fileNamer } from './helpers'

@ApiTags('Files')
@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get('product/:imageName')
	findProductByName(
		@Res() res: Response,
		@Param('imageName') imageName: string,
	) {
		const path = this.filesService.getStaticProductImage(imageName)
		res.sendFile(path)
	}

	@Post('product')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter,
			// limits: { fileSize: 1000 },
			storage: diskStorage({
				destination: './static/products',
				filename: fileNamer,
			}),
		}),
	)
	uploadProductImage(@UploadedFile() file: Express.Multer.File) {
		return this.filesService.getSecureUrl(file)
	}
}
