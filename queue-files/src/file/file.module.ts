import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoProductsSchema } from './schemas/mongo-products.schema';
import { MongoConnectionName } from './enums/mongo-connection-name.enum';
import { mongoprocessedFileIdSchema } from './schemas/mongo-processed-files.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: 'products',
          schema: mongoProductsSchema,
        },
      ],
      MongoConnectionName.LEROY_PRODUCTS,
    ),
    MongooseModule.forFeature(
      [
        {
          name: 'processedFiles',
          schema: mongoprocessedFileIdSchema,
        },
      ],
      MongoConnectionName.LEROY_PRODUCTS,
    ),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
