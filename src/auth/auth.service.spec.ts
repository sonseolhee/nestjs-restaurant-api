import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Role, User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import APIFeatures from '../utils/apiFeatures.utils';

const mockUser = {
  _id: '626be31c80a6d0297a055657',
  email: 'elma1673@gmail.com',
  name: 'Elma',
  role: Role.USER,
  password: 'hashedPassword',
};

const token = 'jwt-Token';

const mockAuthModel = {
  create: jest.fn(),
  findOne: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          // secret: 'ajdsfielJAISDFO189615ASDFA68FDafi134789@#',
          secret: 'secretkey',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUP', () => {
    const signUpDto = {
      email: 'elma1673@gmail.com',
      name: 'Elma',
      password: '123456789',
    };

    it('should register a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser));

      const result = await service.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw duplicate email entered error', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'elma1673@gmail.com',
      password: '123456789',
    };

    it('should login user and return jwt-token', async () => {
      jest.spyOn(model, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(mockUser),
          } as any),
      );

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest.spyOn(APIFeatures, 'assignJwtToken').mockResolvedValueOnce(token);

      const result = await service.login(loginDto);

      expect(result.token).toEqual(token);
    });

    it('should throw invalid email error', async () => {
      jest.spyOn(model, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(null),
          } as any),
      );

      expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw invalid password error', async () => {
      jest.spyOn(model, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(mockUser),
          } as any),
      );

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
