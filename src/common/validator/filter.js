import { Validator } from '@scola/validator';

const filterValidator = new Validator();

filterValidator
  .strict(true);

filterValidator
  .field('')
  .array()
  .with(filterValidator.string().max(255), filterValidator.float());

filterValidator
  .field('id')
  .array()
  .with(filterValidator.float());

filterValidator
  .field('text')
  .array()
  .with(filterValidator.string());

export default filterValidator;
