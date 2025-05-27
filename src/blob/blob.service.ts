// src/blob/blob.service.ts
import { Injectable } from '@nestjs/common';
import { put } from '@vercel/blob';

@Injectable()
export class BlobService {
  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    if (!file || typeof file.originalname !== 'string' || !file.buffer) {
      throw new Error('Invalid file object');
    }
    const blob = await put(`${path}/${file.originalname}`, file.buffer, {
      access: 'public',
    });
    return blob.url;
  }
}
