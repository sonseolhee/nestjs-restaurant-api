import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { CreatMealDto } from './dto/create-meal.dto';
import { updateMealDto } from './dto/update-meal.dto';
import { MealService } from './meal.service';
import { Meal } from './schema/meal.schema';

@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  async getAllMeals(): Promise<Meal[]> {
    return this.mealService.findAll();
  }

  @Get(':id')
  async getMealById(@Param('id') id: string): Promise<Meal> {
    return this.mealService.findMealById(id);
  }

  @Get('/restaurant/:id')
  async getMealsByRestaurant(@Param('id') id: string): Promise<Meal[]> {
    return this.mealService.findByRestaurant(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  createMeal(
    @Body() createMealDto: CreatMealDto,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    return this.mealService.create(createMealDto, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateMealById(
    @Param('id') id: string,
    @Body() updateMealDto: updateMealDto,
    @CurrentUser() user: User,
  ) {
    const meal = await this.mealService.findMealById(id);
    if (meal.user.toString() !== user._id.toString())
      throw new ForbiddenException('You can not update this meal');

    return this.mealService.updateMealById(id, updateMealDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteMealById(@Param('id') id: string, @CurrentUser() user: User) {
    const meal = await this.mealService.findMealById(id);

    if (meal.user.toString() !== user._id.toString())
      throw new ForbiddenException('You can not delete this meal');

    return this.mealService.deleteMealById(id);
  }
}
