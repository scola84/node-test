import objectValidator from '../../common/validator/object';

export default function objectModel(factory) {
  function validate(data, callback) {
    callback(objectValidator.validate(data));
  }

  factory
    .model('i')
    .object()
    .validate(validate);
}
