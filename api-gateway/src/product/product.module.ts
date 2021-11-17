import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConnectionName } from './enums/mongo-connection-name.enum';
import { mongoprocessedFileIdSchema } from './schemas/mongo-processed-files.schema';
import { mongoProductsSchema } from './schemas/mongo-products.schema';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'api-service',
        useFactory: async (
          configService: ConfigService,
        ): Promise<RmqOptions> => ({
          transport: Transport.RMQ,
          options: {
            urls: configService.get('RABBITMQ_URL_CONNECTION'),
            queue: 'files',
            queueOptions: {
              durable: false,
            },
            noAck: false,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    MongooseModule.forFeature(
      [
        {
          name: 'processedFiles',
          schema: mongoprocessedFileIdSchema,
        },
      ],
      MongoConnectionName.LEROY_PRODUCTS,
    ),
    MongooseModule.forFeature(
      [
        {
          name: 'products',
          schema: mongoProductsSchema,
        },
      ],
      MongoConnectionName.LEROY_PRODUCTS,
    ),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
