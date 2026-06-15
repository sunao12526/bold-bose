import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { CaptchaService } from './captcha.service';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error(
    'JWT_SECRET environment variable is required but not defined in .env',
  );
}

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, CaptchaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
