import { Controller, Get, Req } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private githubService: GithubService) {}

  @Get('repos')
  async listRepos(@Req() req) {
    return this.githubService.getUserRepos(req.user.accessToken);
  }
}
