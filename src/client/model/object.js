import objectValidator from '../../common/validator/object';

export default function objectModel(factory, i18n, connection) {
  function validate(data, callback) {
    callback(objectValidator.validate(data));
  }

  factory
    .model('i')
    .object()
    .connection(connection)
    .validate(validate);
}
