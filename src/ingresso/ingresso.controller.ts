import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IngressoService } from './ingresso.service';

@Controller('ingresso')
@ApiTags('ingresso')
export class IngressoController {
    constructor(private readonly ingressoService : IngressoService) { }

    @Get('city/:cityId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Pegar a url do cinema mais proximo para redirecionamento.' })
    @ApiParam({
        name: 'cityId',
        required: true,
        type: Number,
    })
    async getIngressoUrl(@Param('cityId') cityId: number) {
        const movies = await this.ingressoService.getIngressoUrl(Number(cityId));
        return movies;
    }

    @Get('lat/:lat/lng/:lng')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar o cinema mais proximo baseado na latitude e longitude média dos usuários do grupo' })
    @ApiParam({
        name: 'lat',
        required: true,
        type: Number,
    })
    @ApiParam({
        name: 'lng',
        required: true,
        type: Number,
    })
    async getIngressoLatLng(@Param('lat') lat: number, @Param('lng') lng: number) {
        const movies = await this.ingressoService.getIngressoLatLng(Number(lat), Number(lng));
        return movies;
    }
}
