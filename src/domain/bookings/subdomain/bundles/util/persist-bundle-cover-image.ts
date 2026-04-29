import { BadRequestException } from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

export async function persistBundleCoverImage(file: {
  mimetype: string;
  originalname: string;
  buffer: Buffer;
}): Promise<string> {
  if (!file.mimetype.startsWith('image/')) {
    throw new BadRequestException('Arquivo inválido: envie uma imagem.');
  }

  const uploadDirectory = join(process.cwd(), 'uploads', 'booking-bundles');
  await mkdir(uploadDirectory, { recursive: true });

  const safeExtension = extname(file.originalname) || '.jpg';
  const fileName = `bundle-cover-${Date.now()}${safeExtension}`;
  const destinationPath = join(uploadDirectory, fileName);

  await writeFile(destinationPath, file.buffer);
  return `/uploads/booking-bundles/${fileName}`;
}
