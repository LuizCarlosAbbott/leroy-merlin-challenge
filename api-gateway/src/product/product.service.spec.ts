import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { IMongoProcessedFile } from './interfaces/processed-file.interface';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let testingModuleBuilder: TestingModuleBuilder;

  beforeEach(async () => {
    testingModuleBuilder = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'api-service',
          useValue: {},
        },
        {
          provide: getModelToken('processedFiles'),
          useValue: {},
        },
        {
          provide: getModelToken('products'),
          useValue: {},
        },
      ],
    });
  });

  it('should be defined', async () => {
    const testingModule = await testingModuleBuilder.compile();
    service = testingModule.get<ProductService>(ProductService);
    expect(service).toBeDefined();
  });

  describe('fileIsValid()', () => {
    it('should return true', () => {
      const fileMock = 'lm;name;free_shipping;description;price;category\n';

      const result = service.fileIsValid(fileMock);

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const fileMock = 'lm;name;free_shippong;description;price;category\n';

      const result = service.fileIsValid(fileMock);

      expect(result).toBeFalsy();
    });
  });

  describe('findProcessedFile()', () => {
    it('should call processedFilesModel.findOne() and return "The file was successfully processed"', async () => {
      const resultMock = { processed: true } as IMongoProcessedFile;
      const findOneMock = jest
        .fn()
        .mockReturnValue(Promise.resolve(resultMock));
      const testingModule = await testingModuleBuilder
        .overrideProvider(getModelToken('processedFiles'))
        .useValue({
          findOne: findOneMock,
        })
        .compile();
      service = testingModule.get<ProductService>(ProductService);
      const processedFileIdMock = '123123asdasd';
      const result = await service.findProcessedFile(processedFileIdMock);

      expect(findOneMock).toHaveBeenLastCalledWith({
        processedFileId: processedFileIdMock,
      });
      expect(result).toEqual('The file was successfully processed');
    });

    it('should call processedFilesModel.findOne() and return "The file wasn\'t processed successfully"', async () => {
      const resultMock = { processed: false } as IMongoProcessedFile;
      const findOneMock = jest
        .fn()
        .mockReturnValue(Promise.resolve(resultMock));
      const testingModule = await testingModuleBuilder
        .overrideProvider(getModelToken('processedFiles'))
        .useValue({
          findOne: findOneMock,
        })
        .compile();
      service = testingModule.get<ProductService>(ProductService);
      const processedFileIdMock = '123123asdasd';
      const result = await service.findProcessedFile(processedFileIdMock);

      expect(findOneMock).toHaveBeenCalledWith({
        processedFileId: processedFileIdMock,
      });
      expect(result).toEqual("The file wasn't processed successfully");
    });
  });

  describe('findAllProducts()', () => {
    it('should call productsModel.find() and return an array of products', async () => {
      const productsResulMock = [
        {
          lm: 1001,
          name: 'Furadeira X',
          free_shipping: 0,
          description: 'Furadeira eficiente X',
          category: 123123,
        },
        {
          lm: 1002,
          name: 'Furadeira Y',
          free_shipping: 1,
          description: 'Furadeira super eficiente Y',
          category: 123123,
        },
        {
          lm: 1008,
          name: 'Serra de Marmore',
          free_shipping: 1,
          description: 'Serra com 1400W modelo 4100NH2Z-127V-L',
          category: 123123,
        },
      ];
      const findMock = jest
        .fn()
        .mockReturnValue(Promise.resolve(productsResulMock));
      const testingModule = await testingModuleBuilder
        .overrideProvider(getModelToken('products'))
        .useValue({
          find: findMock,
        })
        .compile();
      service = testingModule.get<ProductService>(ProductService);
      const result = await service.findAllProducts();

      expect(findMock).toHaveBeenCalled();
      expect(result).toEqual(productsResulMock);
    });
  });

  describe('findOneProduct()', () => {
    it('should call productsModel.findOneProduct() and return an product', async () => {
      const productResulMock = {
        lm: 1001,
        name: 'Furadeira X',
        free_shipping: 0,
        description: 'Furadeira eficiente X',
        category: 123123,
      };
      const findOneProductMock = jest
        .fn()
        .mockReturnValue(Promise.resolve(productResulMock));
      const testingModule = await testingModuleBuilder
        .overrideProvider(getModelToken('products'))
        .useValue({
          findOne: findOneProductMock,
        })
        .compile();
      service = testingModule.get<ProductService>(ProductService);
      const result = await service.findOneProduct(1001);

      expect(findOneProductMock).toHaveBeenCalled();
      expect(result).toEqual(productResulMock);
    });
  });

  describe('updateOneProduct()', () => {
    it('should call productsModel.findOneAndUpdate() and return an product', async () => {
      const productResulMock = {
        lm: 1001,
        name: 'Furadeira X',
        free_shipping: 0,
        description: 'Furadeira eficiente X',
        category: 123123,
      };
      const findOneAndUpdateMock = jest
        .fn()
        .mockReturnValue(Promise.resolve(productResulMock));
      const testingModule = await testingModuleBuilder
        .overrideProvider(getModelToken('products'))
        .useValue({
          findOneAndUpdate: findOneAndUpdateMock,
        })
        .compile();
      service = testingModule.get<ProductService>(ProductService);
      const result = await service.updateOneProduct(1001, productResulMock);

      expect(findOneAndUpdateMock).toHaveBeenCalled();
      expect(result).toEqual(productResulMock);
    });
  });

  describe('removeOneProduct()', () => {
    it('should call productsModel.findOneAndRemove() and return an product', async () => {
      const productResulMock = {
        lm: 1001,
        name: 'Furadeira X',
        free_shipping: 0,
        description: 'Furadeira eficiente X',
        category: 123123,
      };
      const findOneAndRemoveMock = jest
        .fn()
        .mockReturnValue(Promise.resolve(productResulMock));
      const testingModule = await testingModuleBuilder
        .overrideProvider(getModelToken('products'))
        .useValue({
          findOneAndRemove: findOneAndRemoveMock,
        })
        .compile();
      service = testingModule.get<ProductService>(ProductService);
      const result = await service.removeOneProduct(1001);

      expect(findOneAndRemoveMock).toHaveBeenCalledWith({ lm: 1001 });
      expect(result).toEqual(
        'Product with lm: ' + 1001 + ' was successfully removed',
      );
    });
  });
});
