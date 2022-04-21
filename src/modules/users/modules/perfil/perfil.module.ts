import { Module } from '@nestjs/common';
import { PerfilController } from './perfil.controller';
import { UsersModule } from '../../users.module';
import { forwardRef } from '@nestjs/common';
@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [PerfilController],
})
export class PerfilModule {}
