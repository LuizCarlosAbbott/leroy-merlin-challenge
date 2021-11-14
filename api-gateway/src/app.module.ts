import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoConnectionName } from './product/enums/mongo-connection-name.enum';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['credentials.env'],
    }),
    MongooseModule.forRootAsync({
      connectionName: MongoConnectionName.LEROY_PRODUCTS,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_LEROY_PRODUCTS_URL'),
      }),
      inject: [ConfigService],
    }),
    ProductModule,
  ],
})
export class AppModule {}
