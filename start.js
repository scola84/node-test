export default function start() {
  return (route, router) => {
    const panel = d3.panel()
      .header(true);

    panel.header().title('Menu');

    const aggregate = d3.selectAggregate();

    const list = d3.itemList()
      .first(true)
      .title('Choose something')
      .comment('And a little explanation for the masses.');

    panel.append(list, true);
    aggregate.append(list, true);

    const counterItem = d3.menuItem()
      .label('Counter');

    list.append(counterItem, true);

    // model.on('i', (value) => {
    //   counterItem.sub(d3.i18n().number().format(value));
    // });

    counterItem.root().on('click', () => {
      router.target('menu').element().hide();
      router.target('main').route('counter').go();
    });

    router.target('main').route('counter').on('go', () => {
      counterItem.selected(true);
    });

    const settingsItem = d3.menuItem()
      .action('ion-ios-cloud-download-outline');
    list.append(settingsItem, true);

    function localestart() {
      settingsItem.label(d3.i18n().string().format('settings'));
    }

    d3.i18n().on('locale', localestart);
    // d3.i18n().removeListener('locale', locale);

    localestart();

    settingsItem.root().on('click', () => {
      router.target('menu').element().hide();
      router.target('main').route('settings').go();
    });

    router.target('main').route('settings').on('go', () => {
      // settingsItem.selected(true);
    });

    const thirdItem = d3.menuItem()
      .label('Third');
    list.append(thirdItem, true);

    const secondList = d3.itemList();
    panel.append(secondList);
    aggregate.append(secondList, true);

    const fourthItem = d3.navItem()
      .icon('ion-ios-filing')
      .label('Fourth', '4em')
      .sub('Nog wat');
    secondList.append(fourthItem, true);

    const input = d3.checkItem()
      .icon('ion-ios-musical-notes')
      .label('Notes')
      .first(true);
    secondList.append(input, true);

    const thirdList = d3.itemList();
    panel.append(thirdList, true);

    const item1 = d3.selectItem()
      .label('One');
    thirdList.append(item1, true);

    const item2 = d3.selectItem()
      .label('One');
    thirdList.append(item2, true);

    const item3 = d3.selectItem()
      .label('One');
    thirdList.append(item3, true);

    fourthItem.root().on('click', () => {
      const popup = d3.popUp()
        .body(true);

      const button = d3.popButton()
        .text('OK');

      const button2 = d3.popButton()
        .text('OK');

      button.root()
        .on('click', () => popup.destroy());

      popup.body()
        .title('Hola!')
        .text('Stukkie tekst')
        .direction('row')
        .append(button.first(true), true)
        .append(button2, true);
    });

    return panel;
  };
}




router.target('main').route('counter', (route) => {
  route.on('parameters', (parameters) => {
    console.log(parameters);
  });

  const panel = d3.panelTab()
    .slider(true)
    .buttons(true);

  const musicButton = d3.panelTabButton()
    .icon('ion-ios-musical-notes')
    .text('Music');

  panel.buttons().append(musicButton, true);

  panel.buttons().inner().style('width', '10em');

  const musicPanel = d3.panel()
    .header(true);

  musicPanel.header().title('Music');

  panel.append(musicPanel, true);

  const newButton = d3.panelTabButton()
    .icon('ion-ios-star-outline')
    .text('New');

  panel.buttons().append(newButton, true);

  const newPanel = d3.panel()
    .header(true);

  newPanel.header().title('New');

  panel.append(newPanel, true);

  return panel;
}).default();

router.target('main').route('settings', () => {
  const panel = d3.panel()
    .header(true);

  const button = d3.panelButton()
    .text('Previous')
    .icon('ion-ios-arrow-back')
    .left();

  panel.header().left(button);

  const button2 = d3.panelButton()
    .text('Next')
    // .icon('ion-ios-arrow-forward')
    .center();

  panel.header().center(button2);

  const tab = d3.inlineTab()
    .slider(true)
    .buttons(true);
  panel.append(tab, true);

  const buttonTab = d3.inlineTabButton()
    .text('Verdeling')
    .first(true);

  const buttonTab2 = d3.inlineTabButton()
    .text('Levering');

  tab.buttons().append(buttonTab, true);
  tab.buttons().append(buttonTab2, true);

  tab.buttons().inner().style('width', '50%');

  return panel;
});


(target) => {
  const popover = d3.popOver()
    .slider(true)
    .media();

  popover.root().on('destroy', () => {
    target.destroy(false);
  });

  return popover;
});

router.target('insert').route('main', (route) => {
  const panel = d3.panel()
    .header(true);

  panel.header().title('Insert');

  const cancelButton = d3.panelButton()
    .left()
    .text('Cancel');

  panel.header().left(cancelButton, true);

  const button = d3.panelButton()
    .right()
    .text('Save');

  panel.header().right(button, true);

  // const model =

  const list = d3.itemList()
    .first(true)
    .inset()
    .title('Test');

  panel.append(list, true);

  const textItem = d3.inputItem()
    .label(d3.i18n().string().format('field_text'), '3em');

  list.append(textItem, true);

  button.root().on('click', () => {
    // const data = {
    //   text: (textItem.value())
    // };

    const data = localModel.values();

    factory
      .model('i')
      .object()
      .insert()
      .execute(data, (error) => {
        list.comment(false);

        if (!error) {
          route.target().destroy();
          return;
        }

        list.comment(error.toString(d3.i18n(), null, 'field_'));

        list.comment().style('color', 'red');
      });
  });

  return panel;
}

router.target('menu').route('start', start).default();
