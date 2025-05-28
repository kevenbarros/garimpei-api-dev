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
} from '@nestjs/common';
import { ClothingService } from './clothing.service';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlobService } from 'src/blob/blob.service';
import { Image } from '../image/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('clothing')
export class ClothingController {
  constructor(
    private readonly clothingService: ClothingService,
    private readonly blobService: BlobService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  @Post()
  create(@Body() dto: CreateClothingDto) {
    return this.clothingService.create(dto);
  }

  @Get()
  findAll() {
    return this.clothingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clothingService.findOne(+id);
  }

  @Get(':id/time-remaining')
  getTimeRemaining(@Param('id') id: string) {
    return this.clothingService.getTimeRemaining(+id);
  }

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

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClothingDto) {
    return this.clothingService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clothingService.remove(+id);
  }
}
