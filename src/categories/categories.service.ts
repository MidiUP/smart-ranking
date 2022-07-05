import { PlayersService } from './../players/players.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/ctegory.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const categoryExists = await this.categoryModel
      .findOne({ category })
      .exec();

    if (categoryExists) {
      throw new BadRequestException(`the category is already registered`);
    }

    const categoryCreated = new this.categoryModel(createCategoryDto);

    return await categoryCreated.save();
  }

  async updateCategory(
    _id: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const existsIdCategory = await this.categoryModel.find({ _id }).exec();
    if (!existsIdCategory) {
      throw new BadRequestException(`not found any category with this id`);
    }

    const existCategory = await this.categoryModel.find({ category }).exec();
    if (existCategory.length > 0) {
      throw new BadRequestException(`this category is already registered`);
    }

    return await this.categoryModel
      .findOneAndUpdate({ _id }, { $set: createCategoryDto })
      .exec();
  }

  async getCategories(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async getCategoriesById(_id: string): Promise<Category> {
    return await this.categoryModel.findOne({ _id }).populate('players').exec();
  }

  async deleteCategoryById(_id: string): Promise<void> {
    await this.categoryModel.remove({ _id }).exec();
  }

  async addPlayerInCategory(params: string[]): Promise<void> {
    const category = params['category'];
    const idPlayer = params['idPlayer'];

    const existsCategory = await this.categoryModel
      .findOne({ category })
      .exec();

    const playerAlreadyRegisteredCategory = await this.categoryModel
      .find({ category })
      .where('players')
      .in(idPlayer)
      .exec();

    await this.playersService.getPlayerById(idPlayer);

    if (!existsCategory) {
      throw new BadRequestException('not found category');
    }

    if (playerAlreadyRegisteredCategory.length > 0) {
      throw new BadRequestException(
        `user is already registered in category ${category}`,
      );
    }

    existsCategory.players.push(idPlayer);
    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: existsCategory })
      .exec();
  }
}
