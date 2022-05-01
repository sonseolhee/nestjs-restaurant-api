import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Restaurant } from 'src/restaurants/schemas/restaurant.schema';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schema/meal.schema';

export class CreatMealDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category for this meal' })
  readonly category: Category;

  @IsNotEmpty()
  @IsString()
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide the User ID' })
  readonly user: string;
}
