import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';
import { AuthGuard } from '@nestjs/passport';
import { IRequestWithUser } from 'src/interfaces';

@UseGuards(AuthGuard('jwt'))
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  findAll(@Req() req: IRequestWithUser): Promise<Store[] | Store> {
    console.log('Usuário autenticado:', req.user);
    if (req.user.seller) {
      return this.storeService.findOne(Number(req.user.userId));
    }
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}
