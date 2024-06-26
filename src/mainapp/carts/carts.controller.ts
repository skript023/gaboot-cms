import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Request } from 'express';

@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) {}

    @Post()
    create(@Body() createCartDto: CreateCartDto) {
        return this.cartsService.create(createCartDto);
    }

    @Get()
    findAll(@Req() req: Request) {
        return this.cartsService.findAll(req);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cartsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
        return this.cartsService.update(id, updateCartDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cartsService.remove(id);
    }
}
