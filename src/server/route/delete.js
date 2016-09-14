export default function deleteRoute(router, factory) {
  router.delete('/i/:id', (request, response, next) => {
    factory
      .model('i')
      .object(request.params())
      .delete()
      .execute(request, (error) => {
        if (!error) {
          response.end(true);
        }

        next(error);
      });
  });
}
