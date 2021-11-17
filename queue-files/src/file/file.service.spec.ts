import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { FileService } from './file.service';
import { fileContentMock } from './mocks/fileContentMock';
import { fileMock } from './mocks/fileMock';
import { getProductsFromFileContentMock } from './mocks/getProductsFromFileContentResultMock';

describe('FileService', () => {
  let service: FileService;
  let testingModuleBuilder: TestingModuleBuilder;

  beforeEach(() => {
    testingModuleBuilder = Test.createTestingModule({
      providers: [
        {
          provide: getModelToken('processedFiles'),
          useValue: {},
        },
        {
          provide: getModelToken('products'),
          useValue: {},
        },
        FileService,
      ],
    });
  });

  it('should be defined', async () => {
    const testingModule = await testingModuleBuilder.compile();
    service = testingModule.get<FileService>(FileService);
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should call getProductsFromFileContent() and writeProducts()', async () => {
      const getProductsFromFileContentSpy = jest.spyOn(
        service as any,
        'getProductsFromFileContent',
      );
      const writeProductsSpy = jest
        .spyOn(service as any, 'writeProducts')
        .mockResolvedValue(getProductsFromFileContentMock);
      const processedFileIdMock =
        '51b6a593a79a1a03ddfac986edd98279d70991027dd39a918286eaae43df5292aa176248adc6aef0de07ed4679b0eb1c376a6f505160f7328f2916d0668797f7';

      await service.create(fileMock);

      expect(getProductsFromFileContentSpy).toHaveBeenCalledWith(
        fileContentMock,
      );
      expect(writeProductsSpy).toHaveBeenCalledWith(
        getProductsFromFileContentMock,
        processedFileIdMock,
      );
    });
  });

  describe('getProductsFromFileContent()', () => {
    beforeEach(async () => {
      const testingModule = await testingModuleBuilder.compile();
      service = testingModule.get<FileService>(FileService);
    });
    it('should receive a string and return an array of IProduct', () => {
      const result = service['getProductsFromFileContent'](fileContentMock);

      expect(result).toEqual(getProductsFromFileContentMock);
    });
  });

  describe('writeProducts()', () => {
    it('should succeed on the call to productsModel.insertMany() and after that should call proccessedFilesModel.create()', async () => {
      const insertManySpy = jest.fn().mockReturnValue(Promise.resolve(true));
      const createSpy = jest.fn();
      const testingModule = await testingModuleBuilder
        .overrideProvider(getModelToken('products'))
        .useValue({
          insertMany: insertManySpy,
        })
        .overrideProvider(getModelToken('processedFiles'))
        .useValue({ create: createSpy })
        .compile();
      service = testingModule.get<FileService>(FileService);
      const productsMock = getProductsFromFileContentMock;
      const processedFileIdMock =
        '51b6a593a79a1a03ddfac986edd98279d70991027dd39a918286eaae43df5292aa176248adc6aef0de07ed4679b0eb1c376a6f505160f7328f2916d0668797f7';

      await service['writeProducts'](productsMock, processedFileIdMock);

      expect(insertManySpy).toHaveBeenCalledWith(productsMock, {
        ordered: false,
      });
      expect(createSpy).toHaveBeenCalledWith({
        processedFileId: processedFileIdMock,
        processed: true,
      });
    });

    // it('should fail on the call to productsModel.insertMany() and after that should call proccessedFilesModel.create()', async () => {
    //   const insertManySpy = jest.fn().mockReturnValue(Promise.reject(true));
    //   const createSpy = jest.fn();
    //   const testingModule = await testingModuleBuilder
    //     .overrideProvider(getModelToken('products'))
    //     .useValue({
    //       insertMany: insertManySpy,
    //     })
    //     .overrideProvider(getModelToken('processedFiles'))
    //     .useValue({ create: createSpy })
    //     .compile();
    //   service = testingModule.get<FileService>(FileService);
    //   const productsMock = getProductsFromFileContentMock;
    //   const processedFileIdMock =
    //     '51b6a593a79a1a03ddfac986edd98279d70991027dd39a918286eaae43df5292aa176248adc6aef0de07ed4679b0eb1c376a6f505160f7328f2916d0668797f7';

    //   const result = await service['writeProducts'](
    //     productsMock,
    //     processedFileIdMock,
    //   );

    //   expect(result).toThrowError();
    //   expect(insertManySpy).toHaveBeenCalledWith(productsMock, {
    //     ordered: false,
    //   });
    //   expect(createSpy).toHaveBeenCalledWith({
    //     processedFileId: processedFileIdMock,
    //     processed: false,
    //   });
    // });
  });
});
