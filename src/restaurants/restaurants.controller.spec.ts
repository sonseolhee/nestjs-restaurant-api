import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { getModelToken } from '@nestjs/mongoose';

import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { Role } from '../auth/schemas/user.schema';
import { ForbiddenException } from '@nestjs/common';

const mockRestaurant = {
  _id: '626e3c51811ffb36d74496c5',
  name: 'ElmaRestaurant',
  description: 'This is just a description',
  email: 'e_restaurant@gamil.com',
  phoneNo: 1012345678,
  address: 'Cheongwadae-ro Jongno-gu Seoul, Republic of Korea',
  category: 'Fast Food',
  images: [],
  location: {
    type: 'Point',
    coordinates: [126.977016, 37.583713],
    formattedAddress: 'Cheongwadae-ro, Jongno-gu, 03061, KR',
    city: 'Jongno-gu',
    state: '',
    zipcode: '03061',
    country: 'KR',
  },
  menu: [],
  user: '626be31c80a6d0297a055657',
  createdAt: '2022-05-01T07:52:49.694Z',
  updatedAt: '2022-05-01T08:52:18.247Z',
};

const mockUser = {
  _id: '626be31c80a6d0297a055657',
  email: 'elma1673@gmail.com',
  name: 'Elma',
  role: Role.USER,
};

const mockRestaurantService = {
  findAll: jest.fn().mockResolvedValueOnce([mockRestaurant]),
  create: jest.fn(),
  findById: jest.fn(),
  updateById: jest.fn(),
  deleteImages: jest.fn(),
  deleteById: jest.fn(),
  uploadImages: jest.fn(),
};

describe('RestaurantController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllRestaurants', () => {
    it('should get all restaurants', async () => {
      const result = await controller.getAllRestaurants({
        keyword: 'restaurant',
      });

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockRestaurant]);
    });
  });

  describe('createRestaurant', () => {
    it('should create a new restaurant', async () => {
      const newRestaurant = {
        name: 'ElmaRestaurant',
        description: 'This is just a description',
        email: 'e_restaurant@gamil.com',
        phoneNo: 1012345678,
        address: 'Cheongwadae-ro Jongno-gu Seoul, Republic of Korea',
        category: 'Fast Food',
      };

      mockRestaurantService.create = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const result = await controller.createRestaurant(
        newRestaurant as any,
        mockUser as any,
      );

      expect(service.create).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('updateRestaurant', () => {
    const updateValue = { name: 'updated name' };
    const updtRestaurant = { ...mockRestaurant, name: 'updated name' };

    it('should update restaurant by Id', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      mockRestaurantService.updateById = jest
        .fn()
        .mockResolvedValueOnce(updtRestaurant);

      const result = await controller.updateRestaurant(
        mockRestaurant._id,
        updateValue as any,
        mockUser as any,
      );

      expect(service.findById).toHaveBeenCalled();
      expect(service.updateById).toHaveBeenCalled();
      expect(result).toEqual(updtRestaurant);
      expect(result.name).toEqual(updtRestaurant.name);
    });

    it('should throw forbidden error', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const user = {
        ...mockUser,
        _id: '__wrongId',
      };

      await expect(
        controller.updateRestaurant(
          mockRestaurant._id,
          updateValue as any,
          user as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteRestaurant', () => {
    it('should delete restaurant by Id', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      mockRestaurantService.deleteImages = jest
        .fn()
        .mockResolvedValueOnce(true);

      const result = await controller.deleteRestaurant(
        mockRestaurant._id,
        mockUser as any,
      );

      expect(service.deleteById).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });

    it('should not delete restaurant because images are not deleted properly', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      mockRestaurantService.deleteImages = jest
        .fn()
        .mockResolvedValueOnce(false);

      const result = await controller.deleteRestaurant(
        mockRestaurant._id,
        mockUser as any,
      );

      expect(service.deleteById).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ deleted: false });
    });

    it('should throw forbidden error', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const user = {
        ...mockUser,
        _id: '__wrongId',
      };

      await expect(
        controller.deleteRestaurant(mockRestaurant._id, user as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('uploadFiles', () => {
    it('should upload restaurant images', async () => {
      const mockImages = [
        {
          ETag: '"f130032ca8fc855c9687e8e14e8f10df"',
          Location:
            'https://restarurant-api-bucket.s3.amazonaws.com/restaurants/image1.jpeg',
          key: 'restaurants/image1.jpeg',
          Key: 'restaurants/image1.jpeg',
          Bucket: 'restarurant-api-bucket',
        },
      ];

      const files = [
        {
          fieldname: 'files',
          originalname: 'image1.jpeg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer:
            '<Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff e2 02 1c 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 02 0c 6c 63 6d 73 02 10 00 00 ... 19078 more bytes>',
          size: 19128,
        },
      ];

      const updatedRestaurant = { ...mockRestaurant, images: mockImages };

      mockRestaurantService.uploadImages = jest
        .fn()
        .mockResolvedValueOnce(updatedRestaurant);

      const result = await controller.uploadFiles(
        mockRestaurant._id,
        files as any,
      );

      expect(service.uploadImages).toHaveBeenCalled();
      expect(result).toEqual(updatedRestaurant);
    });
  });
});
