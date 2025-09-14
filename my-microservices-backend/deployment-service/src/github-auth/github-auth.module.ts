import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GithubAuthService } from './github-auth.service';
import { GithubAuthController } from './github-auth.controller';
import { GithubAuthStrategy } from './githubAuth.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config available in all modules
    }),
    PassportModule.register({ defaultStrategy: 'github' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [GithubAuthController],
  providers: [GithubAuthService, GithubAuthStrategy],
  exports: [GithubAuthService],
})
export class GithubAuthModule {}
