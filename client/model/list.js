import filterValidator from '../../common/validator/filter';
import orderValidator from '../../common/validator/order';

export default function listModel(factory, i18n, connection) {
  function translate(field) {
    return i18n().string().format(field);
  }

  function filter(value, callback) {
    callback(filterValidator.validate(value, {
      i18n
    }));
  }

  function order(value, callback) {
    callback(orderValidator.validate(value, {
      i18n
    }));
  }

  factory
    .model('i')
    .list()
    .connection(connection)
    .translate(translate)
    .validate(filter, order);
}
