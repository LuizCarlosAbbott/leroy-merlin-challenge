import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';

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
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
