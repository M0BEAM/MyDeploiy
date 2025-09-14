import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/github')
export class GithubAuthController {
  @Get()
  @UseGuards(AuthGuard('github'))
  async githubLogin() {
    return { message: 'Redirecting to GitHub OAuth...' };
  }

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req) {
    return { message: 'GitHub Auth Successful', user: req.user };
  }
}
