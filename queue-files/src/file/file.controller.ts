import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { FileService } from './file.service';
import { IFile } from './interfaces/file.interface';

const logger = new Logger('Queue Files');
@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @EventPattern('createFile')
  async create(@Payload() file: IFile, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.fileService.create(file);
      channel.ack(message);
      logger.log('File was succesfull processed');
    } catch (error) {
      channel.reject(message, false);
      logger.error(
        'An error occurred during the file processing: ' + error.message,
      );
    }
  }
}
