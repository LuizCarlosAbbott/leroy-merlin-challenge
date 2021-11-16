import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export class IProduct {
  @ApiProperty({
    default: 1002,
  })
  lm: number;
  @ApiProperty({
    default: 'Chave de Fenda X',
  })
  name: string;
  @ApiProperty({
    default: 1,
  })
  free_shipping: number;
  @ApiProperty({
    default: 'Chave de fenda simples',
  })
  description: string;
  @ApiProperty({
    default: 123123,
  })
  category: number;
}

export interface IMongoProduct extends Document {
  lm: number;
  name: string;
  free_shipping: number;
  description: string;
  category: number;
}
