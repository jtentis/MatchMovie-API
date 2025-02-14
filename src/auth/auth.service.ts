import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { PrismaService } from './../prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';

@Injectable()
export class AuthService {

  private brevoApi: SibApiV3Sdk.TransactionalEmailsApi;
  private senderEmail: string;
  private senderName: string;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    this.senderEmail = this.configService.get<string>('BREVO_FROM_EMAIL');
    this.senderName = this.configService.get<string>('BREVO_FROM_NAME');

    if (!apiKey) {
      throw new Error("❌ Brevo API Key is missing! Check your .env file.");
    }

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKeyInstance = defaultClient.authentications['api-key'];
    apiKeyInstance.apiKey = apiKey;

    this.brevoApi = new SibApiV3Sdk.TransactionalEmailsApi();
  }


  async login(email: string, password: string): Promise<AuthEntity> {

    const user = await this.prisma.user.findUnique({ where: { email: email } });
    // console.log(user)
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
      userId: user.id,
    };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('Nenhum usuário com este email foi encontrado!');
    }

    const resetToken = this.jwtService.sign(
      { userId: user.id },
      { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '1h' }
    );

    const resetLink = `myapp://reset-password?token=${resetToken}`;
    console.log(resetToken)

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { email: this.senderEmail, name: this.senderName };
    sendSmtpEmail.to = [{ email, name: "User" }];
    sendSmtpEmail.subject = "Recuperação de senha do Match Movie";
    sendSmtpEmail.htmlContent = `<p><a href="${resetLink}">Clique aqui</a> para recuperar sua senha!</p>`;
    sendSmtpEmail.textContent = `Clique no link para recuperar sua senha: ${resetLink}`;

    await this.brevoApi.sendTransacEmail(sendSmtpEmail);

    return { message: 'Email de recuperação de senha enviado com sucesso!' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return { message: 'Password updated successfully!' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token.');
    }
  }
}