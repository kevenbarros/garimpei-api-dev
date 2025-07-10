// src/blob/blob.service.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { put } from '@vercel/blob';

@Injectable()
export class BlobService {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  private readonly allowedExtensions = ['.jpg', '.jpeg', '.png'];

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    if (!file || typeof file.originalname !== 'string' || !file.buffer) {
      throw new Error('Invalid file object');
    }

    // Valida o tipo MIME
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new ForbiddenException(
        'Tipo de arquivo não permitido. Apenas arquivos JPG, JPEG e PNG são aceitos.',
      );
    }

    // Valida a extensão do arquivo
    const fileExtension = file.originalname
      .toLowerCase()
      .substring(file.originalname.lastIndexOf('.'));
    if (!this.allowedExtensions.includes(fileExtension)) {
      throw new ForbiddenException(
        'Extensão de arquivo não permitida. Apenas arquivos .jpg, .jpeg e .png são aceitos.',
      );
    }

    const blob = await put(`${path}/${file.originalname}`, file.buffer, {
      access: 'public',
    });
    return blob.url;
  }
}
