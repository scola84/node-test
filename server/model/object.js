import objectValidator from '../../common/validator/object';

export default function objectModel(factory, database) {
  factory
    .model('i')
    .object()
    // .authorize(authorize)
    .validate((data, request, callback) => {
      callback(objectValidator.validate(data));
    })
    .select((request, callback) => {
      const query = 'SELECT * FROM i WHERE id = ?';

      database.query(query, [request.param('id')], (error, result) => {
        callback(error, result ? result[0] : result);
      });
    })
    .insert((data, request, callback) => {
      const query = 'INSERT INTO i SET ?';
      database.query(query, data, (error, result) => {
        if (!error) {
          data.id = result.insertId;
        }

        callback(error, result.insertId);
      });
    })
    .update((data, request, callback) => {
      const query = 'UPDATE i SET ? WHERE id = ?';
      database.query(query, [data, request.param('id')], callback);
    })
    .delete((request, callback) => {
      const query = 'DELETE FROM i WHERE id = ?';
      database.query(query, request.param('id'), callback);
    });
}
