import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateProductDto } from './dto/update-product.dto';
import { IFile } from './file.interface';

@Injectable()
export class ProductService {
  constructor(@Inject('api-service') private send2Queue: ClientProxy) {}

  create(file: IFile): Promise<string> {
    return this.send2Queue
      .emit('createFile', file)
      .toPromise()
      .then(() => 'The content was send to the queue')
      .catch((error) => {
        return 'The content was NOT send to the queue';
      });
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
