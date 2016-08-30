import { Validator } from '@scola/validator';

const orderValidator = new Validator();

orderValidator
  .strict(true);

orderValidator
  .field('id')
  .enum()
  .values(['asc', 'desc']);

orderValidator
  .field('text')
  .enum()
  .values(['asc', 'desc']);

export default orderValidator;
