import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OAuth2Service } from './oauth2.service';
import { OAuth2ClientController } from './oauth2-client.controller';
import { OAuth2Controller } from './oauth2.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yudao-nestjs-secret-key-2026',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [OAuth2ClientController, OAuth2Controller],
  providers: [OAuth2Service],
  exports: [OAuth2Service],
})
export class OAuth2Module {}
