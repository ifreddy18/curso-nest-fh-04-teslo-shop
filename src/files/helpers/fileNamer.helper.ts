import { Request } from 'express'
import { v4 as uuid } from 'uuid'

type FileNamerCallback = (error: Error | null, filename: string) => void

export const fileNamer = (
	req: Request,
	file: Express.Multer.File,
	callback: FileNamerCallback,
) => {
	// Don't need to verify, just in case
	if (!file) return callback(new Error('File is empty'), '')

	const fileExtension = file.mimetype.split('/')[1]
	const fileName = `${uuid()}.${fileExtension}`

	callback(null, fileName)
}
