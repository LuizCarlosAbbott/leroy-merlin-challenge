import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFile } from './interfaces/file.interface';
import { IMongoProduct, IProduct } from './interfaces/product.interface';

@Injectable()
export class FileService {
  constructor(
    @InjectModel('products')
    private readonly productsModel: Model<IMongoProduct>,
  ) {}

  async create(file: IFile): Promise<void> {
    const products = this.getProductsFromFileContent(file.content);
    await this.productsModel.insertMany(products, { ordered: false });
  }

  private getProductsFromFileContent(fileContent: string): IProduct[] {
    const fileLines = fileContent.split('\n');
    const products = fileLines
      .slice(1, fileLines.length - 1)
      .map((productLine) => {
        const splittedLine = productLine.split(';');
        return {
          lm: Number(splittedLine[0]),
          name: splittedLine[1],
          free_shipping: Number(splittedLine[2]),
          description: splittedLine[3],
          price: Number(splittedLine[4]),
          category: Number(splittedLine[5]),
        };
      });

    return products;
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
