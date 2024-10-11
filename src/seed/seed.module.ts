import { Module } from '@nestjs/common'

import { ProductsModule } from 'src/products/products.module'
import { AuthModule } from 'src/auth/auth.module'

import { SeedService } from './seed.service'
import { SeedController } from './seed.controller'
import { CommonModule } from 'src/common/common.module'

@Module({
	controllers: [SeedController],
	providers: [SeedService],
	imports: [AuthModule, ProductsModule, CommonModule],
})
export class SeedModule {}
