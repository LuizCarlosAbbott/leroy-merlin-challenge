import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFile } from './interfaces/file.interface';
import { IMongoProcessedFile } from './interfaces/processed-file.interface';
import { IMongoProduct, IProduct } from './interfaces/product.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject('api-service') private send2Queue: ClientProxy,
    @InjectModel('processedFiles')
    private readonly processedFilesModel: Model<IMongoProcessedFile>,
    @InjectModel('products')
    private readonly productsModel: Model<IMongoProduct>,
  ) {}

  fileIsValid(file: string): boolean {
    const [lm, name, free_shipping, description, price, category] = file
      .split('\n')[0]
      .split(';');

    return (
      lm === 'lm' &&
      name === 'name' &&
      free_shipping === 'free_shipping' &&
      description === 'description' &&
      price === 'price' &&
      category === 'category'
    );
  }

  create(file: IFile): Promise<string> {
    return this.send2Queue
      .emit('createFile', file)
      .toPromise()
      .then(
        () =>
          'The content was send to the queue, you can check if the file was processed using the following identification: ' +
          file.processedFileId,
      )
      .catch((error) => {
        return 'The content was NOT send to the queue';
      });
  }
  async findProcessedFile(processedFileId: string): Promise<string> {
    const processedFile = await this.processedFilesModel.findOne({
      processedFileId,
    });

    return processedFile.processed
      ? 'The file was successfully processed'
      : "The file wasn't processed successfully";
  }

  async findAllProducts(): Promise<IProduct[]> {
    return await this.productsModel.find();
  }

  async findOneProduct(lm: number): Promise<IProduct> {
    return await this.productsModel.findOne({ lm });
  }

  async updateOneProduct(lm: number, product: IProduct): Promise<IProduct> {
    const { name, free_shipping, description, category } =
      await this.productsModel.findOneAndUpdate({ lm }, { ...product, lm });

    return { lm, name, free_shipping, description, category, ...product };
  }

  async removeOneProduct(lm: number): Promise<string> {
    const removedProduct = await this.productsModel.findOneAndRemove({ lm });

    return (
      'Product with lm: ' + removedProduct.lm + ' was successfully removed'
    );
  }
}
