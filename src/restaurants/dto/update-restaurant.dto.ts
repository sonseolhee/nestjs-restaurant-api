import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/restaurant.schema';

export class UpdateRestaurantDto {
  // every field is optional

  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsEmail({}, { message: 'Please enter correct email address' })
  @IsOptional()
  readonly phoneNo: number;

  @IsString()
  @IsOptional()
  readonly address: string;

  @IsEnum(Category, { message: 'Please enter correct category' })
  @IsOptional()
  readonly category: Category;

  @IsEmpty({ message: 'You cannot provide the User ID' })
  readonly user: User;
}
