import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GithubAuthService {
  private userTokens = new Map<string, string>();

  constructor(private jwtService: JwtService) {}

  async validateUser(accessToken: string, profile: any) {
    const user = {
      githubId: profile.id,
      username: profile.username,
      avatar: profile.photos[0].value,
      accessToken,  // Save the token to use for repo actions.
    };

    // For example, generate a JWT token for your platform's auth system.
    const jwt = this.jwtService.sign(user);
    // Save the access token associated with the user ID for later use.
    this.userTokens.set(profile.id, accessToken);

    return { user, jwt };
  }

  async getAccessToken(userId: string): Promise<string | null> {
    return this.userTokens.get(userId) || null;
  }
  generateToken(payload: object): string {
    return this.jwtService.sign(payload);
  }
}
