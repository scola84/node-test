export default function listRoute(router, factory) {
  router.get('/i', (request, response, next) => {
    function respond(error, data) {
      if (!error) {
        response.end(data);
      }

      next(error);
    }

    const list = factory
      .model('i')
      .list(request.query());

    if (typeof request.query('page') === 'undefined') {
      list.meta().execute(respond);
      return;
    }

    list
      .page(Number(request.query('page')))
      .select()
      .execute(respond);
  });
}
