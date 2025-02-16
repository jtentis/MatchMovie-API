//src/auth/auth.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  @ApiOperation({ summary: 'Fazer login'})
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Solicitar redefinição de senha'})
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Resetar senha'})
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.authService.resetPassword(token, newPassword);
  }
}