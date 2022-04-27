import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';

import {Query as ExpressQuery} from 'express-serve-static-core'

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) { }

  @Get()
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Post()
  // @UsePipes(ValidationPipe) -> change to global
  async createRestaurant(@Body() restaurant: CreateRestaurantDto): Promise<Restaurant>{
    return await this.restaurantsService.create(restaurant);
  }

  @Get(':id')
  async getRestaurant(
    @Param('id') id: string
  ): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }

  @Put(':id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto
  ): Promise<Restaurant> {
    await this.restaurantsService.findById(id)
    return this.restaurantsService.updateById(id, restaurant)
  }

  @Delete(':id')
  async deleteRestaurant(
    @Param('id') id: string,
  ): Promise<{ deleted: Boolean }> {
    await this.restaurantsService.findById(id)
    const restaurant = await this.restaurantsService.deleteById(id)
    console.log(restaurant)
    if (restaurant) {
      return {
        deleted: true
      }
    }
  }
}
