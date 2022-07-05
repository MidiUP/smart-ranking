import { CategoriesService } from './categories.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interfaces/ctegory.interface';
import { serverError } from 'src/helpers/http/http-helpers';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      return await this.categoriesService.createCategory(createCategoryDto);
    } catch (err) {
      if (err?.response?.statusCode !== 500) {
        throw err;
      }
      serverError(err);
    }
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('_id') _id: string,
  ): Promise<Category> {
    try {
      return await this.categoriesService.updateCategory(
        _id,
        createCategoryDto,
      );
    } catch (err) {
      if (err?.response?.statusCode !== 500) {
        throw err;
      }
      serverError(err);
    }
  }

  @Get()
  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoriesService.getCategories();
    } catch (err) {
      serverError(err);
    }
  }

  @Get(':_id')
  async getCategoryById(@Param('_id') _id: string): Promise<Category> {
    try {
      return await this.categoriesService.getCategoriesById(_id);
    } catch (err) {
      serverError(err);
    }
  }

  @Delete(':_id')
  @HttpCode(204)
  async deleteCategoryById(@Param('_id') _id: string): Promise<void> {
    try {
      return await this.categoriesService.deleteCategoryById(_id);
    } catch (err) {
      serverError(err);
    }
  }

  @Post(':category/players/:idPlayer')
  async addPlayerInCategory(@Param() params: string[]) {
    return await this.categoriesService.addPlayerInCategory(params);
  }
}
