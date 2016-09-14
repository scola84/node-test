import {
  panel,
  panelButton
} from '@scola/d3-panel';

import {
  itemList,
  checkItem,
  inputItem,
  navItem,
  switchItem
} from '@scola/d3-list';

import { objectModel } from '@scola/d3-model';
import { popOver } from '@scola/d3-pop';

export default function insertRoute(router, factory, i18n) {
  router.target('scola.test.insert', (target) => {
    const popover = popOver()
      .slider(true)
      .media();

    popover.root().on('destroy', () => {
      target.destroy(false);
    });

    return popover;
  });

  router.target('scola.test.insert').route('main', (route) => {
    const string = i18n.string();

    const insertModel = objectModel('scola.test.insert');

    const insertPanel = panel()
      .header(true);

    insertPanel
      .header()
      .title('Item');

    const cancelButton = panelButton()
      .right()
      .text('Cancel');

    const insertButton = panelButton()
      .right()
      .text('Save');

    insertPanel
      .header()
      .left(cancelButton, true)
      .right(insertButton, true);

    const list = itemList()
      .first(true)
      .inset()
      .title('Test');

    insertPanel.append(list, true);

    const item1 = inputItem()
      .name('text')
      .model(insertModel);

    list.append(item1, true);

    const item2 = switchItem()
      .name('switch')
      .model(insertModel);

    list.append(item2, true);

    const item3 = navItem()
      .name('duration')
      .model(insertModel);

    list.append(item3, true);

    const durationList = itemList()
      .inset()
      .title('Duration');

    insertPanel.append(durationList, true);

    const items = {};

    [1, 3, 5].forEach((number) => {
      const item = checkItem()
        .name('duration')
        .value(number)
        .model(insertModel);

      durationList.append(item, true);
      items[number] = item;
    });

    function handleCancel() {
      route.target().destroy();
    }

    function handleInsert() {
      if (insertButton.disabled()) {
        return;
      }

      insertModel
        .model(factory
          .model('i')
          .object())
        .insert((error) => {
          if (!error) {
            route.target().destroy();
            return;
          }

          list.comment(error.toString(string, null, 'field_'));
          list.comment().style('color', 'red');
        });
    }

    function handleChange() {
      if (insertModel.diff().length > 0) {
        insertButton.disabled(false);
      } else {
        insertButton.disabled(true);
      }

      Object.keys(items).forEach((number) => {
        items[number].text(string.format('duration.value', {
          index: number
        }));
      });

      item1.text(string.format('text'), '3em');
      item2.text(string.format('switch'));
      item3.text(string.format('duration.name'));

      item3.secondary().text(string.format('duration.value', {
        index: insertModel.get('duration')
      }));
    }

    function handleDestroy() {
      cancelButton.root().on('click', null);
      insertButton.root().on('click', null);

      insertModel.removeListener('change', handleChange);
      insertModel.destroy();
    }

    cancelButton.root().on('click', handleCancel);
    insertButton.root().on('click', handleInsert);

    insertModel.on('change', handleChange);
    route.on('destroy', handleDestroy);

    insertModel.emit('change');

    return insertPanel;
  });
}
