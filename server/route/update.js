export default function updateRoute(router, factory) {
  router.put('/i/:id', (request, response, next) => {
    factory
      .model('i')
      .object(request.params())
      .update()
      .execute(request, (error, result) => {
        if (!error) {
          response.end(result);
        }

        next(error);
      });
  });
}
