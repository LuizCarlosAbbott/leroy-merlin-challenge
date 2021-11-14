import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RABBITMQ_URL_CONNECTION')],
      queue: 'files',
      noAck: false,
      prefetchCount: 50,
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}
bootstrap();
