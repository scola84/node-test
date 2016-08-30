import filterValidator from '../../common/validator/filter';
import orderValidator from '../../common/validator/order';

export default function listModel(factory, database) {
  function filter(filter, callback) {
    callback(filterValidator.validate(filter));
  }

  function order(order, callback) {
    callback(orderValidator.validate(order));
  }

  function meta(filter, order, callback) {
    let query = 'SELECT CEIL(id / 10) AS label, COUNT(*) AS total FROM i';
    query += database.where(filter, ['id', 'text']);
    query += ' GROUP BY label';
    query += database.order(order);

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

  function select(filter, order, limit, callback) {
    let query = 'SELECT * FROM i';
    query += database.where(filter, ['id', 'text']);
    query += database.order(order);
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
