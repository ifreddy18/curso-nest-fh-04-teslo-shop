// import Joi from 'joi' //-> No funciona
import * as Joi from 'joi' //-> Si funciona

export const JoiValidationSchema = Joi.object({
	DB_NAME: Joi.required(),
	DB_PASSWORD: Joi.required(),
	DB_HOST: Joi.string().default('localhost'),
	DB_PORT: Joi.number().default(5432),
	DB_USERNAME: Joi.string().default('postgres'),
	HOST_API: Joi.string().required(),
})
