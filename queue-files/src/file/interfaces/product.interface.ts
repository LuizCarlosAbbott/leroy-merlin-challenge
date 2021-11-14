import { Document } from 'mongoose';

export interface IProduct {
  lm: number;
  name: string;
  free_shipping: number;
  description: string;
  category: number;
}

export interface IMongoProduct extends Document {
  lm: number;
  name: string;
  free_shipping: number;
  description: string;
  category: number;
}
