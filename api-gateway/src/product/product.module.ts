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
        name: 'queue-files',
        useFactory: async (
          configService: ConfigService,
        ): Promise<RmqOptions> => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://rabbitmquser:rabbitmqpass@127.0.0.1:5672'], // [configService.get('RABBITMQ_URL_CONNECTION')],
            queue: 'content',
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
