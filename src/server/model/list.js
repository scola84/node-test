import filterValidator from '../../common/validator/filter';
import orderValidator from '../../common/validator/order';

export default function listModel(factory, database) {
  function filter(value, callback) {
    callback(filterValidator.validate(value));
  }

  function order(value, callback) {
    callback(orderValidator.validate(value));
  }

  function meta(filterValue, orderValue, callback) {
    let query = 'SELECT CEIL(id / 10) AS label, COUNT(*) AS total FROM i';
    query += database.where(filterValue, ['id', 'text']);
    query += ' GROUP BY label';
    query += database.order(orderValue);

    database.query(query, (error, result) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, {
        groups: result
      });
    });
  }

  function select(filterValue, orderValue, limit, callback) {
    let query = 'SELECT * FROM i';
    query += database.where(filterValue, ['id', 'text']);
    query += database.order(orderValue);
    query += database.limit(limit);

    database.query(query, callback);
  }

  factory
    .model('i')
    .list()
    // .authorize(authorize)
    .validate(filter, order)
    .meta(meta)
    .select(select);
}
