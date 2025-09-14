import { Controller, Post, Body, Res, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() body) {
    return this.authService.register(body.name, body.email, body.password, body.role);
  }

@Post('login')
async login(
  @Body() { email, password }: { email: string; password: string },
  @Res() res: Response,
) {
  const result = await this.authService.login(email, password, res);
  return res.json(result); // Manually send the response
}


  @Post('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
