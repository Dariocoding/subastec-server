import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RolesDocument = Roles & Document;

@Schema()
export class Roles {
  @Prop({ required: true })
  nombrerol: string;

  @Prop()
  description: string;

  @Prop()
  status: number;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
