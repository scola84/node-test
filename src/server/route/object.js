export default function objectRoute(router, factory) {
  router.get('/i/:id', (request, response, next) => {
    factory
      .model('i')
      .object(request.params())
      .select()
      .execute(request, (error, data) => {
        if (!error) {
          response.end(data);
        }

        next(error);
      });
  });
}
