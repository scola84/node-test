import { panel, panelButton, panelMessage } from '@scola/d3-panel';
import { menuItem, filterItem, listHeader } from '@scola/d3-list';
import { scroller } from '@scola/d3-scroller';
import { listModel, objectModel } from '@scola/d3-model';

export default function testListRoute(router, factory, i18n) {
  router.target('menu').route('scola.test.list', (route) => {
    let offset = Number(route.parameter('offset') || 0);

    const testModel = listModel('scola.test.list')
      .subscribe(true);

    const helperModel = objectModel('scola.test.helper');

    const listPanel = panel()
      .header(true);

    listPanel
      .header()
      .title(i18n.string().format('menu'));

    const insertButton = panelButton()
      .icon('ion-ios-plus-empty')
      .right();

    listPanel
      .header()
      .right(insertButton, true);

    const scroll = scroller();

    scroll
      .root()
      .style('background', '#FFF');

    listPanel.append(scroll, true);

    const filter = filterItem()
      .name('filter')
      .model(helperModel);

    filter
      .input()
      .attr('placeholder', 'Search');

    scroll
      .root()
      .node()
      .appendChild(filter.root().node());

    scroll
      .extra(10)
      .columns(1)
      .model(testModel)
      .id((datum) => {
        return datum.id;
      })
      .empty(() => {
        return panelMessage()
          .text('No Locations');
      })
      .header((group) => {
        const index = Number(group.label) - 1;
        const begin = (index * 10) + 1;
        const end = (index * 10) + 10;

        return listHeader()
          .text('Items ' + begin + ' - ' + end);
      })
      .enter((datum, index) => {
        const item = menuItem()
          .index(index)
          .name('id')
          .value(datum.id)
          .model(helperModel)
          .text(datum.text);

        return item;
      })
      .change((item, datum, index) => {
        return item
          .index(index)
          .text(datum.text);
      })
      .scroll(() => {
        helperModel.set('offset', scroll.offset());
      });

    function handleChangeInsert() {
      scroll.load(() => {
        scroll
          .span(true)
          .render();
      });
    }

    function handleChangeUpdate() {
      scroll.load(() => {
        scroll
          .span(true)
          .render();
      });
    }

    function handleChangeDelete(event) {
      scroll.load(() => {
        if (helperModel.get('id') === Number(event.diff.id)) {
          const item = scroll.item(helperModel.get('id'));
          const nearest = scroll.next(item.index() - 1) ||
            scroll.previous(item.index());

          const id = nearest ? nearest.value() : null;

          helperModel.set('id', id);
        }

        scroll
          .span(true)
          .render();
      });
    }

    function handleChangeFilter(event) {
      testModel
        .model(factory
          .model('i')
          .list({
            filter: event.value,
            order: 'id:asc'
          }))
        .meta((error) => {
          if (error) {
            console.log(error);
            return;
          }

          route
            .parameter('filter', event.value || null)
            .go('replace');

          scroll
            .clear()
            .load(() => {
              scroll
                .count(true)
                .span(true)
                .offset(offset);

              offset = 0;
            });
        });
    }

    function handleChangeOffset(event) {
      route
        .parameter('offset', event.value)
        .go('replace');
    }

    function handleChangeHelper(event) {
      if (event.name === 'filter') {
        handleChangeFilter(event);
      }

      if (event.name === 'offset') {
        handleChangeOffset(event);
      }
    }

    function handleChange(event) {
      if (event.action === 'insert') {
        handleChangeInsert(event);
      }

      if (event.action === 'update') {
        handleChangeUpdate(event);
      }

      if (event.action === 'delete') {
        handleChangeDelete(event);
      }
    }

    function handleInsert() {
      router
        .target('scola.test.insert')
        .route('main')
        .go('push');
    }

    function handleRoute(parameters) {
      setTimeout(() => {
        helperModel.set('filter', parameters.filter || '');
        helperModel.set('offset', parameters.offset || 0);
      });
    }

    function handleDestroy() {
      route.removeListener('parameters', handleRoute);
      route.removeListener('destroy', handleDestroy);

      testModel.removeListener('change', handleChange);
      testModel.destroy();

      helperModel.removeListener('change', handleChangeHelper);
      helperModel.destroy();

      insertButton.root().on('click', null);
    }

    function construct() {
      route.on('parameters', handleRoute);
      route.on('destroy', handleDestroy);

      testModel.on('change', handleChange);
      helperModel.on('change', handleChangeHelper);

      insertButton.root().on('click', handleInsert);
    }

    construct();

    return listPanel;
  });
}
