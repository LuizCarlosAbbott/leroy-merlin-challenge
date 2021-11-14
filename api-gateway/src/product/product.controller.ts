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
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFile } from './interfaces/file.interface';
import { randomBytes } from 'crypto';

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
      const processedFileId = randomBytes(64).toString('hex');
      console.log(processedFileId);
      const response = await this.productService.create({
        ...file,
        content,
        processedFileId,
      });
      logger.log('File sended to queue');
      return response;
    } catch (error) {
      logger.error('Something went wrong with the request: ' + error.message);
      return 'Something went wrong with your request';
    }
  }

  @Get('processedfile/:id')
  findProcessedFile(@Param('id') id: string) {
    return this.productService.findProcessedFile(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
