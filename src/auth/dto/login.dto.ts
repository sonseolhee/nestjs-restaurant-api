import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginpDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email address' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
