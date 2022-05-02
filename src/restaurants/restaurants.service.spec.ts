import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { Model } from 'mongoose';

const mockRestaurantService = {};

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
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
