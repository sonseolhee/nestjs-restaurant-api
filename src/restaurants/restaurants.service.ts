import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import mongoose from 'mongoose';
import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all restaurants => Get /restaurants
  async findAll(query: Query): Promise<Restaurant[]> {
    const perPage = 4;
    const currentPage = Number(query.currentPage) || 1;
    const skip = perPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const restaurants = await this.restaurantModel
      .find({ ...keyword })
      .limit(perPage)
      .skip(skip);

    return restaurants;
  }

  // Create new restaurant => POST /restaurants
  async create(restaurant: Restaurant): Promise<Restaurant> {
    return await this.restaurantModel.create(restaurant);
  }

  //Get a restaurant by ID => Get /restaurants/:id
  async findById(id: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
      throw new BadRequestException(
        'Wrong moongoose ID Error. Please enter correct ID',
      );

    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  // Update a restaurant by ID => PUT /restaurants/:id
  async updateById(id: string, restaurant: Restaurant): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true, //give you the object after `update` was applied.
      runValidators: true, //automatically sanitize potentially unsafe user-generated query projections
    });
  }

  // Delete a restaurant by ID => DELETE /restaurants/:id
  async deleteById(id: string): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndDelete(id);
  }
}
