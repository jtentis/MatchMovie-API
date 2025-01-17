import { Test, TestingModule } from '@nestjs/testing';
import { WatchedService } from './watched.service';

describe('WatchedService', () => {
  let service: WatchedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchedService],
    }).compile();

    service = module.get<WatchedService>(WatchedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
