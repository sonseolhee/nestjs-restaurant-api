import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { Meal } from './schema/meal.schema';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: mongoose.Model<Meal>,

    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all meals => GET /meals
  async findAll(): Promise<Meal[]> {
    return await this.mealModel.find();
  }

  // Get all meals of restaurant => GET /meals/restaurnat/:id
  async findByRestaurant(id: string): Promise<Meal[]> {
    return this.mealModel.find({ restaurant: id });
  }

  // Create a new meal => POST /meals/:restaurant
  async create(meal: Meal, user: User): Promise<Meal> {
    const restaurant = await this.restaurantModel.findById(meal.restaurant);

    if (!restaurant)
      throw new NotFoundException('Restaurant not found with this ID');

    if (restaurant.user._id.toString() !== user._id.toString())
      throw new ForbiddenException('You can not add meal to this restaurant');

    const data = Object.assign(meal, {
      user: user._id,
    });
    const mealCreated = await this.mealModel.create(data);

    restaurant.menu.push(mealCreated);
    await restaurant.save();

    return mealCreated;
  }

  // Get a meal with ID => GET /meals/:id
  async findMealById(id: string): Promise<Meal> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
      throw new BadRequestException(
        'Wrong Mongoose ID Error. Please enter correct ID',
      );

    const meal = await this.mealModel.findById(id);
    if (!meal) throw new NotFoundException('Meal not found');

    return meal;
  }

  // Update a meal with ID => PUT /meals/:id
  async updateMealById(id: string, meal: Meal) {
    return await this.mealModel.findByIdAndUpdate(id, meal, {
      new: true,
      runValidators: true,
    });
  }

  // Delete a meal with ID => DELETE /meals/:id
  async deleteMealById(id: string): Promise<{ deleted: boolean }> {
    const result = await this.mealModel.findByIdAndDelete(id);
    const res = this.restaurantModel.findByIdAndDelete(result.id);

    if (result && res) return { deleted: true };
    return { deleted: false };
  }
}
