import {
  panel,
  panelButton
} from '@scola/d3-panel';

import {
  itemList,
  checkItem,
  inputItem,
  navItem,
  switchItem,
  listButton
} from '@scola/d3-list';

import {
  objectModel,
  MODE_SUB
} from '@scola/d3-model';

import {
  popUp,
  popButton
} from '@scola/d3-pop';

export default function updateRoute(router, factory, i18n) {
  router.target('main').route('scola.test.update', (route) => {
    const string = i18n.string();

    const testModel = objectModel('scola.test.object')
      .mode(MODE_SUB);

    const helperModel = objectModel('scola.test.helper');

    const updatePanel = panel()
      .header(true);

    updatePanel
      .header()
      .title('Item');

    const updateButton = panelButton()
      .right()
      .text('Save');

    updatePanel
      .header()
      .right(updateButton, true);

    const list = itemList()
      .first(true)
      .inset()
      .title('Test');

    updatePanel.append(list, true);

    const item1 = inputItem()
      .name('text')
      .text(string.format('text'), '3em')
      .model(testModel);

    list.append(item1, true);

    const item2 = switchItem()
      .name('switch')
      .text(string.format('switch'))
      .model(testModel);

    list.append(item2, true);

    const item3 = navItem()
      .name('duration')
      .text(string.format('duration.name'))
      .model(testModel);

    list.append(item3, true);

    const durationList = itemList()
      .inset()
      .title('Duration');

    updatePanel.append(durationList, true);

    const items = {};

    [1, 3, 5].forEach((number) => {
      const item = checkItem()
        .name('duration')
        .value(number)
        .model(testModel);

      durationList.append(item, true);
      items[number] = item;
    });

    const buttonList = itemList()
      .inset();

    updatePanel.append(buttonList, true);

    const deleteButton = listButton()
      .text('Delete');

    deleteButton.root()
      .style('color', 'red');

    buttonList.append(deleteButton, true);

    let pop = null;

    function lock(text) {
      updateButton.disabled(true);
      deleteButton.disabled(true);
      updatePanel.message(text);
      list.comment(false);
    }

    function unlock() {
      if (testModel.diff().length > 0) {
        updateButton.disabled(false);
      } else {
        updateButton.disabled(true);
      }

      deleteButton.disabled(false);
      updatePanel.message(false);
      list.comment(false);
    }

    function handleUpdate() {
      if (updateButton.disabled() === true) {
        return;
      }

      testModel.update((error) => {
        list.comment(false);

        if (error) {
          list.comment(error.toString(string, null, 'field_'));
          list.comment().style('color', 'red');
        }
      });
    }

    function handleDelete() {
      if (deleteButton.disabled()) {
        return;
      }

      pop = popUp()
        .body(true);

      const cancel = popButton()
        .first(true)
        .text('Cancel');

      cancel.root().on('click', () => {
        pop.destroy();
        pop = null;
      });

      const ok = popButton()
        .text('OK');

      ok.root().on('click', () => {
        testModel.delete(() => {
          pop.destroy();
          pop = null;
        });
      });

      pop.body()
        .text('Are you sure you want to delete this item?')
        .direction('row')
        .append(cancel, true)
        .append(ok, true);
    }

    function handleCommitTest() {
      updateButton.disabled(true);
    }

    function handleSetTest(event) {
      if (event.diff.length > 0) {
        updateButton.disabled(false);
      } else {
        updateButton.disabled(true);
      }

      Object.keys(items).forEach((number) => {
        items[number].text(string.format('duration.value', {
          index: number
        }));
      });

      item3.secondary().text(string.format('duration.value', {
        index: testModel.get('duration')
      }));
    }

    function handleChangeTest(event) {
      testModel
        .values(event.data)
        .commit();
    }

    function handleChangeHelper(event) {
      if (event.name !== 'id' || !event.value) {
        return;
      }

      testModel
        .model(factory
          .model('i')
          .object({
            id: event.value
          }))
        .select((error) => {
          if (error) {
            lock(error.toString(string));
            return;
          }

          unlock();

          route
            .parameter('id', event.value)
            .go('replace');
        });
    }

    function handleRoute(parameters) {
      if (typeof parameters.id !== 'undefined') {
        unlock();
        helperModel
          .set('id', Number(parameters.id))
          .commit();
      } else {
        helperModel.set('id', null);
        lock(string.format('not_selected'));
      }
    }

    function handleDestroy() {
      route.removeListener('parameters', handleRoute);
      route.removeListener('destroy', handleDestroy);

      testModel.removeListener('set', handleSetTest);
      testModel.removeListener('commit', handleCommitTest);
      testModel.removeListener('change', handleChangeTest);
      testModel.destroy();

      helperModel.removeListener('change', handleChangeHelper);
      helperModel.destroy();

      updateButton.root().on('click', null);
      deleteButton.root().on('click', null);

      if (pop) {
        pop.destroy();
      }
    }

    function construct() {
      route.on('parameters', handleRoute);
      route.on('destroy', handleDestroy);

      testModel.on('set', handleSetTest);
      testModel.on('commit', handleCommitTest);
      testModel.on('change', handleChangeTest);

      helperModel.on('set', handleChangeHelper);

      updateButton.root().on('click', handleUpdate);
      deleteButton.root().on('click', handleDelete);
    }

    construct();

    return updatePanel;
  });
}