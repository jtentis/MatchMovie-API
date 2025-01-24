import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GeolocationService } from './geolocation.service';

@ApiTags('geolocation')
@Controller('geolocation')
export class GeolocationController {

    constructor(private readonly geolocationService: GeolocationService){}

    @Get(':groupId/midpoint')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Calcular ponto médio de latitude entre usuários' })
    async getGroupMidpoint(@Param('groupId') groupId: number): Promise<any> {
        const midpoint = await this.geolocationService.calculateMidpoint(Number(groupId));
        return { message: 'Midpoint calculated successfully', midpoint };
    }
}
