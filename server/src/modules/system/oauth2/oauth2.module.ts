import { Module } from '@nestjs/common';
import { OAuth2Service } from './oauth2.service';
import { OAuth2ClientController } from './oauth2-client.controller';

@Module({
  controllers: [OAuth2ClientController],
  providers: [OAuth2Service],
  exports: [OAuth2Service],
})
export class OAuth2Module {}
