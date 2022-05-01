import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Restaurant } from '../../restaurants/schemas/restaurant.schema';

export enum Category {
  SOUPS = 'Soups',
  SALADS = 'Salads',
  PASTA = 'Pasta',
  PIZZA = 'Pizza',
}

@Schema({
  timestamps: true,
})
export class Meal {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
