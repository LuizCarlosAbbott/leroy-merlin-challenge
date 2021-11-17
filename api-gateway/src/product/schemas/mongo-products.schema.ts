import * as mongoose from 'mongoose';

export const mongoProductsSchema = new mongoose.Schema({
  lm: Number,
  name: String,
  free_shipping: Number,
  description: String,
  category: Number,
});

mongoProductsSchema.index({ lm: 1 }, { unique: true });
