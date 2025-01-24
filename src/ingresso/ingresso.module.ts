import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IngressoController } from './ingresso.controller';
import { IngressoService } from './ingresso.service';

@Module({
  controllers: [IngressoController],
  providers: [IngressoService],
  imports: [HttpModule],
  exports: [IngressoService]
})
export class IngressoModule {}