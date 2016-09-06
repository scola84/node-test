import listModel from './model/list';
import objectModel from './model/object';
import listRoute from './route/list';
import objectRoute from './route/object';
import insertRoute from './route/insert';
import deleteRoute from './route/delete';
import updateRoute from './route/update';

export default function server(router, factory, database, pubsub) {
  if (pubsub) {
    pubsub.addListener('open', () => {
      factory.model('i').subscribe(true);
    });
  }

  listModel(factory, database);
  objectModel(factory, database);

  listRoute(router, factory);
  objectRoute(router, factory);

  insertRoute(router, factory);
  deleteRoute(router, factory);
  updateRoute(router, factory);
}
