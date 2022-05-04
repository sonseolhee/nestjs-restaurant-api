import { Test } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from './schemas/user.schema';

const jwtToken = 'jwt-Token';

const mockUser = {
  _id: '626be31c80a6d0297a055657',
  email: 'elma1673@gmail.com',
  name: 'Elma',
  role: Role.USER,
  password: 'hashedPassword',
};

const mockAuthService = {
  signUp: jest.fn().mockResolvedValueOnce(mockUser),
  login: jest.fn().mockResolvedValueOnce(jwtToken),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      const signUpDto = {
        email: 'elma1673@gmail.com',
        name: 'Elma',
        password: '123456789',
      };

      const result = await controller.signUp(signUpDto);

      expect(service.signUp).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should login user and return jwt-token', async () => {
      const loginDto = {
        email: 'elma1673@gmail.com',
        password: '123456789',
      };

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });
});
