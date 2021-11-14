import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';
import { IFile } from './interfaces/file.interface';
import { IMongoProcessedFile } from './interfaces/processed-file.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject('api-service') private send2Queue: ClientProxy,
    @InjectModel('processedFiles')
    private readonly processedFilesModel: Model<IMongoProcessedFile>,
  ) {}

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

  findAll() {
    return `This action returns all product`;
  }

  async findProcessedFile(processedFileId: string): Promise<string> {
    const processedFile = await this.processedFilesModel.findOne({
      processedFileId,
    });

    return processedFile.processed
      ? 'The file was successfully processed'
      : "The file wasn't processed successfully";
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
