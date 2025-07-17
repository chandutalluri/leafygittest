import { Controller, Get, Param, Res, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ImageService } from '../services/image.service';

@Controller('api/image-management')
export class ImageServeController {
  constructor(private readonly imageService: ImageService) {}

  @Get('serve/:filename')
  async serveImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const imageStream = await this.imageService.getImageStream(filename);
      
      // Set appropriate headers
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
      
      // Pipe the image stream to the response
      imageStream.pipe(res);
    } catch (error) {
      throw new HttpException(
        `Image not found: ${filename}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}