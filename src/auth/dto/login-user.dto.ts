import {
	IsEmail,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator'

const emailRegex = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/

export class LoginUserDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@Matches(emailRegex, {
		message:
			'The password must have a Uppercase, lowercase letter and a number',
	})
	password: string
}
