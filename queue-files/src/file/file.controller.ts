import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @MessagePattern('createFile')
  create(@Payload() createFileDto: CreateFileDto) {
    return this.fileService.create(createFileDto);
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
