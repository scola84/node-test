export default function insertRoute(router, factory) {
  router.post('/i', (request, response, next) => {
    factory
      .model('i')
      .object()
      .insert()
      .execute(request, (error, result, model) => {
        if (!error) {
          response
            .status(201)
            .header('id', model.id())
            .end(result);
        }

        next(error);
      });
  });
}
