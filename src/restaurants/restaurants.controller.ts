import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  async createRestaurant(
    @Body() restaurant: CreateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return await this.restaurantsService.create(restaurant, user);
  }

  @Get(':id')
  async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateRestaurant(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    const res = await this.restaurantsService.findById(id);

    if (res.user._id.toString() !== user._id.toString())
      throw new ForbiddenException('You can not update this restaurant');

    return this.restaurantsService.updateById(id, restaurant);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteRestaurant(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: Boolean }> {
    const restaurant = await this.restaurantsService.findById(id);

    if (restaurant.user._id.toString() !== user._id.toString())
      throw new ForbiddenException('You can not delete this restaurant');

    const isDeleted = await this.restaurantsService.deleteImages(
      restaurant.images,
    );
    if (isDeleted) {
      await this.restaurantsService.deleteById(id);
      return {
        deleted: true,
      };
    } else {
      return {
        deleted: false,
      };
    }
  }

  //To handle file uploading, Nest provides a built-in module based on the multer middleware package for Express.
  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.restaurantsService.findById(id);
    return await this.restaurantsService.uploadImages(id, files);
  }

  //todo: deletId by images' key
  @Put(':id/images/:imageKey')
  async deleteFile(
    @Param('id') id: string,
    @Param('imageKey') imageKey: string,
  ) {
    const restaurant = await this.restaurantsService.findById(id);
    const images = restaurant.images;

    console.log(images);
    images.filter((image) => {});
  }
}
