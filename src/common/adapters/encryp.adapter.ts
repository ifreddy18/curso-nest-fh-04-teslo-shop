import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class EncryptAdapter {
	hashSync(password: string): string {
		const saltOrRounds: string | number = 10
		return bcrypt.hashSync(password, saltOrRounds)
	}

	compareSync(password: string, realPassword: string): boolean {
		return bcrypt.compareSync(password, realPassword)
	}
}
