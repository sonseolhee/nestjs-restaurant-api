import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/restaurant.schema';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email address' })
  readonly email: string;

  @IsPhoneNumber('KR')
  @IsNotEmpty()
  readonly phoneNo: number;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsEnum(Category, { message: 'Please enter correct category' })
  @IsNotEmpty()
  readonly category: Category;

  @IsEmpty({ message: 'You cannot provide the User ID' })
  readonly user: User;
}
