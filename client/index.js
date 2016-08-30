import data from '../common/i18n/data';

import listModel from './model/list';
import objectModel from './model/object';

import insertRoute from './route/insert';
import listRoute from './route/list';
import updateRoute from './route/update';

export default function client(router, factory, i18n) {
  data(i18n);

  listModel(factory, i18n);
  objectModel(factory, i18n);

  insertRoute(router, factory, i18n);
  listRoute(router, factory, i18n);
  updateRoute(router, factory, i18n);
}
