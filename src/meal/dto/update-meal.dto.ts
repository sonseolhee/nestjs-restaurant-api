import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../schema/meal.schema';

export class updateMealDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category for this meal' })
  readonly category: Category;

  @IsOptional()
  @IsString()
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide the User ID' })
  readonly user: string;
}
