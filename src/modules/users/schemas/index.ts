import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './user.schema';
import { RolesSchema, Roles } from './roles.schema';
export * from './roles.schema';
export * from './user.schema';

export const MongooseModulesUser = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Roles.name, schema: RolesSchema },
]);
