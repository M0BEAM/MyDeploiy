import { Test, TestingModule } from '@nestjs/testing';
import { GithubAuthController } from './github-auth.controller';
import { GithubAuthService } from './github-auth.service';

describe('GithubAuthController', () => {
  let controller: GithubAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubAuthController],
      providers: [GithubAuthService],
    }).compile();

    controller = module.get<GithubAuthController>(GithubAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
