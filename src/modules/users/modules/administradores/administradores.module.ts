import { forwardRef, Module } from '@nestjs/common';
import { AdministradoresController } from './administradores.controller';
import { UsersModule } from '../../users.module';
import { AdministradoresService } from './administradores.service';
import { MongooseModulesUser } from '../../schemas';

@Module({
  imports: [forwardRef(() => UsersModule), MongooseModulesUser],
  controllers: [AdministradoresController],
  providers: [AdministradoresService],
})
export class AdministradoresModule {}
