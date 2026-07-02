import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  Res,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OAuth2Service } from './oauth2.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { Public } from '../../../shared/decorators/public.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import type { Response } from 'express';
import { OAuth2AuthorizeQueryDto, OAuth2TokenBodyDto } from '../dto/oauth2-input.dto';
import { OAuth2TokenResponseDto, OAuth2UserInfoResponseDto } from '../dto/oauth2-response.dto';

@ApiTags('系统 - OAuth2 认证流')
@Controller('system/oauth2')
export class OAuth2Controller {
  constructor(
    private readonly oauth2Service: OAuth2Service,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('authorize')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'OAuth2 授权申请接口 (Authorization Code 模式)' })
  async authorize(
    @Query() query: OAuth2AuthorizeQueryDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const { client_id: clientId, redirect_uri: redirectUri, response_type: responseType, scope: scopeStr, state } = query;

    if (responseType !== 'code') {
      throw new BadRequestException(
        'Unsupported response_type. Must be "code".',
      );
    }

    const clients = await this.prisma.oAuth2Client.findMany({
      where: { clientId, status: 'ENABLE' },
    });
    if (clients.length === 0) {
      throw new BadRequestException('OAuth2 client not found or disabled.');
    }
    const client = clients[0];

    // Validate redirect URI
    const allowedUris: string[] = JSON.parse(client.redirectUris || '[]');
    if (!allowedUris.includes(redirectUri)) {
      throw new BadRequestException(
        'Redirect URI not authorized for this client.',
      );
    }

    const scopes = scopeStr ? scopeStr.split(' ') : [];

    // Generate code
    const code = await this.oauth2Service.generateCode(
      req.user.id,
      clientId,
      scopes,
    );

    // Redirect back
    const targetUrl = `${redirectUri}?code=${code}${state ? `&state=${state}` : ''}`;
    return res.redirect(targetUrl);
  }

  @Public()
  @Post('token')
  @ApiOperation({ summary: 'OAuth2 获取 Access Token 接口' })
  @ApiOkResponse({ type: OAuth2TokenResponseDto })
  async token(
    @Body() body: OAuth2TokenBodyDto,
  ) {
    const { grant_type: grantType, code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri } = body;

    const clients = await this.prisma.oAuth2Client.findMany({
      where: { clientId, status: 'ENABLE' },
    });
    if (clients.length === 0) {
      throw new BadRequestException('OAuth2 client not found or disabled.');
    }
    const client = clients[0];

    if (client.secret !== clientSecret) {
      throw new UnauthorizedException('Client secret invalid.');
    }

    if (grantType === 'authorization_code') {
      if (!code) {
        throw new BadRequestException('Code is required for authorization_code grant type.');
      }
      try {
        const { userId, scopes } = await this.oauth2Service.verifyCode(
          code,
          clientId,
        );

        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });
        if (!user || user.status === 'DISABLE') {
          throw new UnauthorizedException('User not found or disabled.');
        }

        // Issue token
        const payload = { id: user.id, username: user.username, scopes };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { 
          expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any 
        });

        return {
          access_token: accessToken,
          token_type: 'Bearer',
          expires_in: parseInt(process.env.JWT_EXPIRES_IN_SECONDS || '86400', 10),
          refresh_token: refreshToken,
          scope: scopes.join(' '),
        };
      } catch (err: any) {
        throw new BadRequestException(
          err.message || 'Authorization code validation failed.',
        );
      }
    } else if (grantType === 'client_credentials') {
      const payload = { clientId, scopes: JSON.parse(client.scopes || '[]') };
      const accessToken = this.jwtService.sign(payload);
      return {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: parseInt(process.env.JWT_EXPIRES_IN_SECONDS || '86400', 10),
      };
    }

    throw new BadRequestException('Unsupported grant_type.');
  }

  @Public()
  @Get('userinfo')
  @ApiOperation({ summary: 'OAuth2 获取用户信息接口 (携带 Bearer Access Token)' })
  @ApiOkResponse({ type: OAuth2UserInfoResponseDto })
  async userinfo(@Req() req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header.',
      );
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify(token);
      if (payload.clientId) {
        // Client credentials token
        return { sub: `client_${payload.clientId}`, client_id: payload.clientId, scopes: payload.scopes };
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          username: true,
          nickname: true,
          email: true,
          mobile: true,
          status: true,
        },
      });
      if (!user || user.status === 'DISABLE') {
        throw new UnauthorizedException('User not found or disabled.');
      }

      return {
        sub: `user_${user.id}`,
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        mobile: user.mobile,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}

