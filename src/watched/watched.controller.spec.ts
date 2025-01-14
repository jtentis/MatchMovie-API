import { Test, TestingModule } from '@nestjs/testing';
import { WatchedController } from './watched.controller';

describe('WatchedController', () => {
  let controller: WatchedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchedController],
    }).compile();

    controller = module.get<WatchedController>(WatchedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
