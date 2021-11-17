import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { IProduct } from './interfaces/product.interface';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
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
    }).compile();

    productService = module.get<ProductService>(ProductService);
    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findProcessedFile()', () => {
    it('should call productService.findProcessedFile and return "The file was successfully processed"', async () => {
      const idMock = 'mockedId';
      const findProcessedFileSpy = jest
        .spyOn(productService, 'findProcessedFile')
        .mockImplementation(jest.fn())
        .mockReturnValue(
          Promise.resolve('The file was successfully processed'),
        );
      const result = await controller.findProcessedFile(idMock);

      expect(findProcessedFileSpy).toHaveBeenLastCalledWith(idMock);
      expect(result).toEqual('The file was successfully processed');
    });

    it('should call productService.findProcessedFile and return "The file wasn\'t processed successfully"', async () => {
      const idMock = 'mockedId';
      const findProcessedFileSpy = jest
        .spyOn(productService, 'findProcessedFile')
        .mockImplementation(jest.fn())
        .mockReturnValue(
          Promise.resolve("The file wasn't processed successfully"),
        );
      const result = await controller.findProcessedFile(idMock);

      expect(findProcessedFileSpy).toHaveBeenLastCalledWith(idMock);
      expect(result).toEqual("The file wasn't processed successfully");
    });
  });

  describe('findOneProduct()', () => {
    it('should call productService.findOneProduct() and return his result', async () => {
      const lmMock = '1003';
      const productMock = {
        lm: 1002,
        name: 'Chave de Fenda X',
        free_shipping: 1,
        description: 'Chave de fenda simples',
        category: 123123,
      } as IProduct;
      const findOneProductSpy = jest
        .spyOn(productService, 'findOneProduct')
        .mockImplementation(jest.fn())
        .mockReturnValue(Promise.resolve(productMock));
      const result = await controller.findOneProduct(lmMock);

      expect(findOneProductSpy).toHaveBeenCalledWith(Number(lmMock));
      expect(result).toEqual(productMock);
    });
  });

  describe('updateOneProduct()', () => {
    it('should call productService.updateOneProduct() and return his result', async () => {
      const lmMock = '1002';
      const productMock = {
        lm: 1002,
        name: 'Chave de Fenda X',
        free_shipping: 1,
        description: 'Chave de fenda simples',
        category: 123123,
      } as IProduct;
      const updateOneProductSpy = jest
        .spyOn(productService, 'updateOneProduct')
        .mockImplementation(jest.fn())
        .mockReturnValue(Promise.resolve(productMock));
      const result = await controller.updateOneProduct(lmMock, productMock);

      expect(updateOneProductSpy).toHaveBeenCalledWith(
        Number(lmMock),
        productMock,
      );
      expect(result).toEqual(productMock);
    });
  });

  describe('removeOneProduct()', () => {
    it('should call productService.removeOneProduct() and return his result', async () => {
      const resultMock = 'Product with lm: 1001 was successfully removed';
      const removeOneProductSpy = jest
        .spyOn(productService, 'removeOneProduct')
        .mockImplementation(jest.fn())
        .mockResolvedValue(resultMock);
      const result = await controller.removeOneProduct('1001');

      expect(removeOneProductSpy).toHaveBeenCalledWith(1001);
      expect(result).toEqual(resultMock);
    });
  });
});
