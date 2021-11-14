import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
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
        uri: configService.get('MONGODB_LEROY_PRODUCTS_URL'),
      }),
      inject: [ConfigService],
    }),
    FileModule,
  ],
})
export class AppModule {}
