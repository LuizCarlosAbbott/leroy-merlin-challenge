import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['credentials.env'],
    }),
    MongooseModule.forRootAsync({
      connectionName: 'leroy-products',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: 'mongodb://localhost:27017/products?readPreference=primary&ssl=false', // configService.get('LEROY_PRODUCTS'),
      }),
      inject: [ConfigService],
    }),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
