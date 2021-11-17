import { IFile } from '../interfaces/file.interface';

export const fileMock: IFile = {
  fieldname: 'file',
  originalname: 'products.csv',
  encoding: '7bit',
  mimetype: 'text/csv',
  buffer: Buffer.from('123'),
  size: 409,
  content:
    'lm;name;free_shipping;description;price;category\n1001;Furadeira X;0;Furadeira eficiente X;100.00;123123\n1002;Furadeira Y;1;Furadeira super eficiente Y;140.00;123123\n1003;Chave de Fenda X;0;Chave de fenda simples;20.00;123123\n1008;Serra de Marmore;1;Serra com 1400W modelo 4100NH2Z-127V-L;399.00;123123\n1009;Broca Z;0;Broca simples;3.90;123123\n1010;Luvas de Proteção;0;Luva de proteção básica;5.60;123123\n',
  processedFileId:
    '51b6a593a79a1a03ddfac986edd98279d70991027dd39a918286eaae43df5292aa176248adc6aef0de07ed4679b0eb1c376a6f505160f7328f2916d0668797f7',
};
