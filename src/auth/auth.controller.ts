import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginpDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //register a new user
  @Post('/signup')
  signUp(@Body() signupDto: SignUpDto): Promise<User> {
    return this.authService.create(signupDto);
  }

  //login
  @Post('/login')
  login(@Body() loginDto: LoginpDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
