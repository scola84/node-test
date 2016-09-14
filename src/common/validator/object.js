import { Validator } from '@scola/validator';

const object = new Validator();

object
  .field('text').required().integer().min(10).max(100);

export default object;
