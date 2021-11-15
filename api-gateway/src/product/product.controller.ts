import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Bind,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFile } from './interfaces/file.interface';
import { randomBytes } from 'crypto';
import { IProduct } from './interfaces/product.interface';

const logger = new Logger('API Gateway');

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @Bind(UploadedFile())
  async uploadFile(file: IFile): Promise<string> {
    try {
      const content = file.buffer.toString();

      if (this.productService.fileIsValid(content)) {
        const processedFileId = randomBytes(64).toString('hex');
        const response = await this.productService.create({
          ...file,
          content,
          processedFileId,
        });
        logger.log('File sended to queue');
        return response;
      } else {
        throw new Error('Invalid format');
      }
    } catch (error) {
      logger.error('Something went wrong with the request: ' + error.message);
      throw new HttpException(
        'Something went wrong with your request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('processedfile/:id')
  async findProcessedFile(@Param('id') id: string): Promise<string> {
    try {
      const processedFile = await this.productService.findProcessedFile(id);
      logger.log('Processed file: ' + id + ' was successfully found');
      return processedFile;
    } catch (error) {
      logger.error('Processed file: ' + id + " wasn't successfully found");
      throw new HttpException(
        'Something went wrong with your request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAllProducts(): Promise<IProduct[]> {
    try {
      const products = await this.productService.findAllProducts();

      logger.log('Products were successfully searched');
      return products;
    } catch (error) {
      logger.error("Products weren't successfully found, error: " + error);
      throw new HttpException(
        'Something went wrong with your request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':lm')
  async findOneProduct(@Param('lm') lm: string): Promise<IProduct> {
    try {
      const product = await this.productService.findOneProduct(+lm);

      logger.log('Product with lm: ' + lm + ' was successfully searched');
      return product;
    } catch (error) {
      logger.error(
        'Product with lm: ' +
          lm +
          " wasn't successfully found, error: " +
          error,
      );
      throw new HttpException(
        'Something went wrong with your request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':lm')
  async updateOneProduct(
    @Param('lm') lm: string,
    @Body() product: IProduct,
  ): Promise<IProduct> {
    try {
      const updatedProduct = await this.productService.updateOneProduct(
        +lm,
        product,
      );
      logger.log('Product with lm: ' + lm + ' was successfully updated');
      return updatedProduct;
    } catch (error) {
      logger.error(
        'Product with lm: ' +
          lm +
          " wasn't successfully updated, error: " +
          error,
      );
      throw new HttpException(
        'Something went wrong with your request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':lm')
  async removeOneProduct(@Param('lm') lm: string): Promise<string> {
    try {
      const result = await this.productService.removeOneProduct(+lm);
      logger.log(result);
      return result;
    } catch (error) {
      logger.error('Product with lm: ' + lm + " wasn't successfully removed");
      throw new HttpException(
        'Something went wrong with your request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
