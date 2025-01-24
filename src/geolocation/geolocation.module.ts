import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GeolocationController } from './geolocation.controller';
import { GeolocationService } from './geolocation.service';

@Module({
  controllers: [GeolocationController],
  providers: [GeolocationService],
  imports: [HttpModule, PrismaModule],
  exports: [GeolocationService]
})
export class GeolocationModule {}