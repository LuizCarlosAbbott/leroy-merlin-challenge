import { Document } from 'mongoose';

export interface IMongoProcessedFile extends Document {
  processedFileId: string;
  processed: boolean;
}
