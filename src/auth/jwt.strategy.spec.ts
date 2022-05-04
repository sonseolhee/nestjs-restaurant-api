import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { Role, User } from './schemas/user.schema';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  _id: '626be31c80a6d0297a055657',
  email: 'elma1673@gmail.com',
  name: 'Elma',
  role: Role.USER,
  password: 'hashedPassword',
};

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let model: Model<User>;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'jwt-secret';
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validates and return user', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockUser);

      const result = await jwtStrategy.validate({ id: mockUser._id });

      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('should throw Unauthorized Exception', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      expect(jwtStrategy.validate({ id: mockUser._id })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
