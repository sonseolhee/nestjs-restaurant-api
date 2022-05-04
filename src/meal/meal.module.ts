import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Meal, MealSchema } from './schema/meal.schema';
import { AuthModule } from '../auth/auth.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [
    AuthModule,
    RestaurantsModule,
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
  ],
  controllers: [MealController],
  providers: [MealService],
})
export class MealModule {}
