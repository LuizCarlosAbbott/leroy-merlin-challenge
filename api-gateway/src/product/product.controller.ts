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
import { ApiBody, ApiDefaultResponse, ApiParam } from '@nestjs/swagger';

const logger = new Logger('API Gateway');
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @Bind(UploadedFile())
  @ApiParam({
    name: 'file',
    format: 'multipart/form-data',
    description: `You have to upload a text file that needs to have the following structure: <br/><br/>
    lm;name;free_shipping;description;price;category <br/>
    1001;Furadeira X;0;Furadeira eficiente X;100.00;123123 <br/>
    1002;Furadeira Y;1;Furadeira super eficiente Y;140.00;123123 <br/>
    `,
  })
  @ApiDefaultResponse({
    type: String,
    status: 200,
    description: 'Returns a text with the identifier of the file uploaded',
  })
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
  @ApiDefaultResponse({
    type: String,
    status: 200,
    description:
      'Returns a text confirmating if the file was successfully processed',
  })
  @ApiParam({
    name: 'id',
    example:
      '9d444b94bc92d1017cdea5fb87bf5f804d0df77d7163a46038e5ba59dfcf9e5f5d998b4c9a2962b007b3bf4a1c8311bb32baf0ab8e5ea0d98e59710d4257a620',
  })
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
  @ApiDefaultResponse({
    type: [IProduct],
    status: 200,
    description: 'Returns an array of products from the database',
  })
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
  @ApiParam({
    name: 'lm',
    example: '1002',
  })
  @ApiDefaultResponse({
    type: IProduct,
    status: 200,
    description: 'Returns an product from the database',
  })
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
  @ApiParam({
    name: 'lm',
    example: '1002',
  })
  @ApiBody({ type: IProduct })
  @ApiDefaultResponse({
    type: IProduct,
    status: 200,
    description: 'Updates a product and returns the updated product',
  })
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
  @ApiParam({
    name: 'lm',
    example: '1002',
  })
  @ApiDefaultResponse({
    type: IProduct,
    status: 200,
    description: 'Removes a product and returns the removed product',
  })
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
