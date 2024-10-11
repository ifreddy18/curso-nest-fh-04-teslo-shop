import { Module } from '@nestjs/common'
import { EncryptAdapter } from './adapters/encryp.adapter'

@Module({
	providers: [EncryptAdapter],
	exports: [EncryptAdapter],
})
export class CommonModule {}
