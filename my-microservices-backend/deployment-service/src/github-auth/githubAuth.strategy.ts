import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { GithubAuthService } from './github-auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubAuthStrategy extends PassportStrategy(Strategy, 'github') {
 
  constructor(
    private githubAuthService: GithubAuthService,
    private configService: ConfigService,
  ) {
    const clientID = configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = configService.get<string>('GITHUB_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GITHUB_CALLBACK_URL');
    console.log('GITHUB_CLIENT_ID:', clientID);
    console.log('GITHUB_CLIENT_SECRET:', clientSecret);

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['user', 'repo'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return this.githubAuthService.validateUser(accessToken, profile);
  }
}
