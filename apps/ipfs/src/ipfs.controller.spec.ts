import { Test, TestingModule } from '@nestjs/testing';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';

describe('IpfsController', () => {
  let ipfsController: IpfsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IpfsController],
      providers: [IpfsService],
    }).compile();

    ipfsController = app.get<IpfsController>(IpfsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ipfsController.getHello()).toBe('Hello World!');
    });
  });
});
