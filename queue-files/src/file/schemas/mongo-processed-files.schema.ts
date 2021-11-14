import * as mongoose from 'mongoose';

export const mongoprocessedFileIdSchema = new mongoose.Schema({
  processedFileId: String,
  processed: Boolean,
});

mongoprocessedFileIdSchema.index({ processedFileId: 1 }, { unique: true });
