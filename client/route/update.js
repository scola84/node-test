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

import { objectModel } from '@scola/d3-model';

import {
  popUp,
  popButton
} from '@scola/d3-pop';

export default function updateRoute(router, factory, i18n) {
  router.target('main').route('scola.test.update', (route) => {
    const string = i18n.string();

    const appModel = objectModel('scola.test.app');
    const testModel = objectModel('scola.test.object');
    const helperModel = objectModel('scola.test.helper');

    const updatePanel = panel()
      .header(true);

    updatePanel
      .header()
      .title('Item');

    const reloadButton = panelButton()
      .icon('ion-ios-refresh-empty')
      .left();

    updatePanel
      .header()
      .left(reloadButton, true);

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
      .model(testModel, (value) => {
        return string.format('duration.value', {
          index: value
        });
      });

    list.append(item3, true);

    const durationList = itemList()
      .inset()
      .title('Duration');

    updatePanel.append(durationList, true);

    [1, 3, 5].forEach((number) => {
      const item = checkItem()
        .name('duration')
        .value(number)
        .model(testModel)
        .text(string.format('duration.value', {
          index: number
        }));

      durationList.append(item, true);
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
        } else {
          testModel.commit();
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

    function handleReload() {
      testModel.fetch((error) => {
        if (error) {
          lock(error.toString(i18n.string()));
          return;
        }

        unlock();
      });
    }

    function handleChangeApp(event) {
      if (event.name === 'status' && event.value === 'online') {
        handleReload();
      }
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

      appModel.removeListener('set', handleChangeApp);

      updateButton.root().on('click', null);
      deleteButton.root().on('click', null);
      reloadButton.root().on('click', null);

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
      appModel.on('set', handleChangeApp);

      updateButton.root().on('click', handleUpdate);
      deleteButton.root().on('click', handleDelete);
      reloadButton.root().on('click', handleReload);
    }

    construct();

    return updatePanel;
  });
}
