import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FileService } from './file.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { IFile } from './file.interface';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @EventPattern('createFile')
  create(@Payload() file: IFile, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      console.log(file);
      channel.ack(message);
      return this.fileService.create(file);
    } catch (error) {
      channel.reject(message, false);
    }
  }

  @MessagePattern('findAllFile')
  findAll() {
    return this.fileService.findAll();
  }

  @MessagePattern('findOneFile')
  findOne(@Payload() id: number) {
    return this.fileService.findOne(id);
  }

  @MessagePattern('updateFile')
  update(@Payload() updateFileDto: UpdateFileDto) {
    return this.fileService.update(updateFileDto.id, updateFileDto);
  }

  @MessagePattern('removeFile')
  remove(@Payload() id: number) {
    return this.fileService.remove(id);
  }
}
