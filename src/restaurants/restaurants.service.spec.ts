import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { Model } from 'mongoose';
import { Role } from '../auth/schemas/user.schema';
import APIFeatures from '../utils/apiFeatures.utils';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

const mockRestaurantModel = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('RestaurantService', () => {
  let service: RestaurantsService;
  let model: Model<Restaurant>;

  //create testingModule
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantModel,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should get all restaurants', async () => {
      jest.spyOn(model, 'find').mockImplementationOnce(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockRestaurant]),
            }),
          } as any),
      );

      const restaurants = await service.findAll({ keyword: 'restaurant' });
      expect(restaurants).toEqual([mockRestaurant]);
    });
  });

  describe('create', () => {
    const newRestaurant = {
      name: 'ElmaRestaurant',
      description: 'This is just a description',
      email: 'e_restaurant@gamil.com',
      phoneNo: 1012345678,
      address: 'Cheongwadae-ro Jongno-gu Seoul, Republic of Korea',
      category: 'Fast Food',
    };

    it('should create a new restaurant', async () => {
      jest
        .spyOn(APIFeatures, 'getRestaurantLocation')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant.location));

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant));

      const result = await service.create(
        newRestaurant as any,
        mockUser as any,
      );

      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('findById', () => {
    it('should get restaurant by Id', async () => {
      jest
        .spyOn(model, 'findById')
        .mockResolvedValueOnce(mockRestaurant as any);

      const result = await service.findById(mockRestaurant._id);
      expect(result).toEqual(mockRestaurant);
    });

    it('should throw wrrong mongoose Id error', async () => {
      await expect(service.findById('__wrongId')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw restaurant not found error', async () => {
      jest
        .spyOn(model, 'findById')
        .mockRejectedValue(new NotFoundException('Restaurant not found'));

      await expect(service.findById(mockRestaurant._id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateById', () => {
    it('should update the restaurant', async () => {
      const updateValue = { name: 'updated' };
      const tobeUpdatedWith = { ...mockRestaurant, name: 'updated' };

      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(tobeUpdatedWith as any);

      const updatedRestaurant = await service.updateById(
        mockRestaurant._id,
        updateValue as any,
      );

      expect(updatedRestaurant.name).toEqual(tobeUpdatedWith.name);
    });
  });

  describe('deleteById', () => {
    it('should delete the restaurant', async () => {
      jest
        .spyOn(model, 'findByIdAndDelete')
        .mockResolvedValueOnce(mockRestaurant as any);

      const result = await service.deleteById(mockRestaurant._id);
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('uploadImages', () => {
    it('should upload restaurant images on AWS-S3-Budcket', async () => {
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
      jest.spyOn(APIFeatures, 'upload').mockResolvedValueOnce(mockImages);
      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(updatedRestaurant as any);

      const result = await service.uploadImages(
        mockRestaurant._id,
        files as any,
      );

      expect(result).toEqual(updatedRestaurant);
    });
  });

  describe('deleteImages', () => {
    it('should delete restaurant images from AWs-S3-Bucket', async () => {
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
      jest
        .spyOn(APIFeatures, 'deleteImages')
        .mockResolvedValueOnce(Promise.resolve(true) as any);

      const result = await service.deleteImages(mockImages);

      expect(result).toBe(true);
    });
  });
});
