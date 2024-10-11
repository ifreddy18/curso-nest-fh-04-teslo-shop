import { Request } from 'express'

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void

export const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	callback: FileFilterCallback,
) => {
	if (!file) return callback(new Error('File is empty'), false)

	const fileExtension = file.mimetype.split('/')[1]
	const validExtensions = ['jpg', 'jpeg', 'png', 'gif']

	if (!validExtensions.includes(fileExtension))
		return callback(new Error('File with invalid extension'), false)

	callback(null, true)
}
