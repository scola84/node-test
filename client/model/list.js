/* eslint no-shadow: 0 */

import filterValidator from '../../common/validator/filter';
import orderValidator from '../../common/validator/order';

export default function listModel(factory, i18n) {
  function translate(field) {
    return i18n().string().format(field);
  }

  function filter(filter, callback) {
    callback(filterValidator.validate(filter, {
      i18n
    }));
  }

  function order(order, callback) {
    callback(orderValidator.validate(order, {
      i18n
    }));
  }

  factory
    .model('i')
    .list()
    .translate(translate)
    .validate(filter, order);
}
