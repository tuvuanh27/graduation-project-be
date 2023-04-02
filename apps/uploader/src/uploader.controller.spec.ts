import { Test, TestingModule } from '@nestjs/testing';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';

describe('UploaderController', () => {
  let uploaderController: UploaderController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UploaderController],
      providers: [UploaderService],
    }).compile();

    uploaderController = app.get<UploaderController>(UploaderController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(uploaderController.getHello()).toBe('Hello World!');
    });
  });
});
