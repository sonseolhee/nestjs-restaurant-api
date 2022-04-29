import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginpDto } from './dto/login.dto';
import APIfeature from '../utils/apiFeatures.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(signupDto: SignUpDto): Promise<User> {
    const { password, ...rest } = signupDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        ...rest,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicate email entered.');
      }
    }
  }

  async login(loginDto: LoginpDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user)
      throw new UnauthorizedException('Invalid email address or password');

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid email address or password');

    const token = await APIfeature.assignJwtToken(user._id, this.jwtService);

    return { token };
  }
}
