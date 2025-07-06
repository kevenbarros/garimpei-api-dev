import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  UploadedFiles,
  Req,
  Query,
} from '@nestjs/common';
import { ClothingService } from './clothing.service';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BlobService } from 'src/blob/blob.service';
import { Image } from '../image/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { IRequestWithUser } from 'src/interfaces';

@Controller('clothing')
export class ClothingController {
  constructor(
    private readonly clothingService: ClothingService,
    private readonly blobService: BlobService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateClothingDto) {
    return this.clothingService.create(dto);
  }

  @Get()
  findAll(
    @Req() req: IRequestWithUser,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    if (req?.user?.seller) {
      return this.clothingService.findAllPerUser(req.user.userId);
    }
    return this.clothingService.findAll(Number(page), Number(limit));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('finished-with-bids')
  async getFinishedWithBids(@Req() req: IRequestWithUser) {
    if (req?.user?.seller) {
      return this.clothingService.findFinishedWithBidsBySeller(req.user.userId);
    }
    return this.clothingService.findFinishedByBuyer(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('won-auctions')
  async getWonAuctions(@Req() req: IRequestWithUser) {
    if (req?.user?.seller) {
      return this.clothingService.findFinishedWithBidsBySeller(req.user.userId);
    }
    return this.clothingService.findAuctionsWonByBuyer(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clothingService.findOne(+id);
  }

  @Get(':id/time-remaining')
  getTimeRemaining(@Param('id') id: string) {
    return this.clothingService.getTimeRemaining(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const path = `clothing/${id}`;
    const imageUrl = await this.blobService.uploadFile(file, path);

    // Salva a URL no banco
    const clothing = await this.clothingService.findOne(+id);
    const image = this.imageRepository.create({ url: imageUrl, clothing });
    await this.imageRepository.save(image);

    return { imageUrl };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-with-image')
  @UseInterceptors(FileInterceptor('image'))
  async createWithImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: any,
  ) {
    // Cria o produto
    const clothing = await this.clothingService.create(body);

    // Faz upload da imagem
    const path = `clothing/${clothing.id}`;
    const imageUrl = await this.blobService.uploadFile(file, path);

    // Salva a imagem associada ao produto
    const image = this.imageRepository.create({ url: imageUrl, clothing });
    await this.imageRepository.save(image);

    // Retorna o produto com a imagem
    return {
      ...clothing,
      images: [{ url: imageUrl }],
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-with-images')
  @UseInterceptors(FilesInterceptor('images', 10)) // até 10 imagens
  async createWithImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateClothingDto,
  ) {
    const clothing = await this.clothingService.create(body);

    const images: { url: string }[] = [];
    for (const file of files) {
      const path = `clothing/${clothing.id}`;
      const imageUrl = await this.blobService.uploadFile(file, path);
      const image = this.imageRepository.create({ url: imageUrl, clothing });
      await this.imageRepository.save(image);
      images.push({ url: imageUrl });
    }

    return {
      ...clothing,
      images,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClothingDto) {
    return this.clothingService.update(+id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clothingService.remove(+id);
  }
}
