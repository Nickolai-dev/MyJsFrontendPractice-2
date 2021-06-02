const $ = window.$ = DEV_ENV === 'production' ? require('jquery/dist/jquery.min'): require('jquery');
require('bootstrap/js/src/util');
require('bootstrap/js/src/dropdown');
require('bootstrap/js/src/modal');
require('bootstrap/js/src/button');
require('bootstrap/js/src/tab');
require('bootstrap/js/src/collapse');
require('./jquery.popper-placement');

const appTree = window.appTree = {
  sections: [
    {
      title: 'Ecommerce',
      icon: 'fa-home',
      contents: [{
        pathName: 'homePage',
        html: require('src/app-pages/dashboard-1.html'),
        title: 'Dashboard v.1',
        icon: 'fa-bullseye'
      }, {
        pathName: 'dashboard2',
        html: require('src/app-pages/dashboard-2.html'),
        title: 'Dashboard v.2',
        icon: 'fa-circle-o'
      }, {
        pathName: 'dashboard3',
        html: require('src/app-pages/dashboard-3.html'),
        title: 'Dashboard v.3',
        icon: 'fa-cube'
      }]
    }, {
      title: 'Mailbox',
      icon: 'fa-envelope',
      contents: [{
        pathName: 'inbox',
        html: require('src/app-pages/inbox.html'),
        title: 'Inbox',
        icon: 'fa-inbox'
      }, {
        pathName: 'view-mail',
        title: 'View Mail',
        icon: 'fa-television',
        html: require('src/app-pages/view-mail.html')
      }, {
        title: 'Compose Mail',
        pathName: 'compose-mail',
        icon: 'fa-paper-plane',
        html: require('src/app-pages/compose-mail.html')
      }]
    }, {
      title: 'Forms Elements',
      icon: 'fa-table',
      contents: [{
        title: 'Bc Form Elements',
        icon: 'fa-pencil',
        pathName: 'basic-form-elements',
        html: require('src/app-pages/basic-form-elements.html'),
      }, {
        title: 'Ad Form Elements',
        icon: 'fa-lightbulb-o',
        pathName: 'advanced-form-elements',
        html: require('src/app-pages/advanced-form-elements.html'),
      }, {
        title: 'Password Meter',
        icon: 'fa-hourglass',
        pathName: 'password-meter',
        html: require('src/app-pages/password-meter.html'),
      }, {
        title: 'Multi Upload',
        icon: 'fa-hdd-o',
        pathName: 'multi-upload',
        html: require('src/app-pages/multi-upload.html'),
      }, {
        title: 'Text Editor',
        icon: 'fa-globe',
        pathName: 'text-editor',
        html: require('src/app-pages/text-editor.html'),
      }, {
        title: 'Dual List Box',
        icon: 'fa-hand-paper-o',
        pathName: 'dual-list-box',
        html: require('src/app-pages/dual-list-box.html'),
      }]
    },
  ],
};
appTree.sections = appTree.sections.concat([{
  title: 'Landing Page',
  icon: 'fa-bookmark',
  pathName: 'homePage',
  html: appTree.sections[0].contents[0].html,
  notCollapse: true
}]);
appTree.find = function(name, searchBy = 'pathName') {
  for(let i = 0; i < appTree.sections.length; i++) {
    let section = appTree.sections[i];
    if (section[searchBy] && section.pathName) {
      return section;
    }
    for (let j = 0; j < section.contents.length; j++) {
      let page = section.contents[j];
      if (page[searchBy] === name) {
        return page;
      }
    }
  }
  return appTree.sections[0].contents[0];
}
let appRoot = window.appRoot = {
  app: document.getElementById('app'),
  main: document.getElementById('main'),
  header: document.getElementById('header'),
  sidebar: document.getElementById('sidebar'),
};
let historyStateObject = {};
let pageTitle = document.querySelector('title');
let getAppLocation = function (urlpathname) {
  let reg = /[^/]+$/.exec(urlpathname), pageName = reg ? reg[0] : '';
  return appTree.find(pageName) ? pageName : 'homePage';
}

let safeExec = function(callbacks) {
  for(let callback of callbacks) {
    try {
      callback();
    } catch (e) {
      console.log(e);
    }
  }
}, lazyExec = function(callbacks) {
  /**
   * @param callbacks: [{callback: ()=>any, then: [()=>any, ...]},
   *            **OR** callback: ()=>any, ...] OR ()=>any
   */
  for (let callback of typeof callbacks === 'function' ? [callbacks] : callbacks) {
    let promise = new Promise((resolve, reject) => {
      let val = typeof callback === 'function' ? callback() : callback.callback();
      resolve(val);
    }).catch(reason => {
      console.log(reason);
    });
    if (typeof callback !== 'object') {
      continue;
    }
    for (let then of callback.then) {
      promise = promise.then(value => {
        then();
      });
    }
  }
};

let asyncGoToPage = function(pageName, goBack = false) {
  if (!pageName) {
    pageName = getAppLocation(window.location.pathname);
  }
  let page = appTree.find(pageName) || appTree.homePage;
  if (!goBack) {
    history.pushState(historyStateObject, page.title, '/' + pageName);
  }
  new Promise((resolve, reject) => {
    appRoot.main.innerHTML = page.html;
    resolve();
  }).catch((reason) => {
    console.log(reason);
  }).then((val) => {
    updatePagesLinksBinds();
    updateMainContentBinds();
    pageTitle.innerHTML = page.title;
  });
};

let updatePagesLinksBinds = function(jq) {
  let onPageLinkClick = function(ev) {
    let location = new URL(ev.originalEvent.currentTarget.href);
    let pageName = getAppLocation(location.pathname);
    asyncGoToPage(pageName);
  };
  (jq ? jq.find('.app-page') : $('.app-page')).off('click.appPageManagement')
    .on('click.appPageManagement', (ev) => {ev.preventDefault(); onPageLinkClick(ev);});
};

window.addEventListener('popstate', function (ev) {
  if(!ev.target.location.hostname in ['localhost']) {
    return;
  }
  asyncGoToPage(getAppLocation(ev.target.location.pathname), true);
});

require('./basic-form-elements');
require('./advanced-form-elements');
require('./jquery.drag-drop-upload');
require('./jquery.dual-list-box');
require('malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min');

$.fn.extend({
  mScrollbar: function () {
    $(this).each(function (i, b) {
      /**
       * block`s parent position css prop must be relative
       */
      let block = $(b), wrapper = block.wrap('<div class="w-100 h-100 position-static"></div>').parent();
      wrapper.mCustomScrollbar({
        autoHideScrollbar: true,
        scrollbarPosition: 'outside',
        scrollInertia: 500,
        mouseWheel: {
          scrollAmount: 90,
        }
      });
      let mcsbScrollbar = wrapper.children('.mCSB_scrollTools'),
          draggerContainer = mcsbScrollbar.find('.mCSB_draggerContainer'),
          draggerRail = draggerContainer.find('.mCSB_draggerRail');
      mcsbScrollbar.css('right', '0');
      draggerContainer.append(draggerRail);
      draggerContainer.css({
        // 'height': 'calc(100% - 5px)',
        // 'top': '2px'
      })
      draggerRail.css({'background-color': 'rgba(0, 0, 0, 0.3);'})
    });
  }
});

require('./menu-material');

let appHeader = $(require('../header.html')), toggleInsertHeader = function () {
  $(appRoot.header).empty().append(appHeader);
  appHeader.find('#sidebarCollapse').on('click', (ev) => $(appRoot.sidebar).parent().toggleClass('sidebar-hide'));
  $('.menu-material', appHeader).menuMaterial();
  $('[data-toggle="dropdown"][data-popper-placement]').controlPopperPlacement();
  lazyExec([() => $('#MessageBoxDropdown', appHeader).menuMaterialFillIn({
    content: {
      type: 'message',
      data: () => loadContentCached('/api?database=messages', content => JSON.parse(content).query)
    }
  }), () => $('#NotificationsBoxDropdown', appHeader).menuMaterialFillIn({
    content: {
      type: 'notification',
      data: () => loadContentCached('/api?database=notifications', content => JSON.parse(content).query)
    }
  })]);
}
let appSidebar = window.appSidebar = {query: require('../components/app-sidebar.html')}, createAppSidebar = function() {
  let query = $(appSidebar.query), block = $(query[0]), containerElem = block.find('ul'),
      collapseProto = $(query[1]), itemProto = $(query[2]);
  containerElem.attr('id', 'accordionMenu');
  for (let i = 0; i < appTree.sections.length; i++) {
    let section = appTree.sections[i];
    if(!section.notCollapse) {
      let collapseItem = collapseProto.clone(),
          collapseId = section.title.toLowerCase().replace(' ','_').replace('.','_'),
          collapseContainer = collapseItem.find('ul.accordion-menu__content'), items = $([]);
      collapseItem.find('.accordion-menu__item-heading[data-toggle="collapse"]').attr(
        {'data-target': '#' + collapseId, 'aria-controls': collapseId, 'id': collapseId + '_heading'});
      collapseItem.find('.accordion-menu__name').text(section.title);
      collapseItem.find('.accordion-menu__icon > i').addClass(section.icon);
      collapseItem.find('.accordion-menu__container').attr(
        {'data-parent': '#accordionMenu', 'id': collapseId, 'aria-labelledby': collapseId + '_heading'});
      containerElem.append(collapseItem);
      for (let j = 0; j < section.contents.length; j++) {
        let page = section.contents[j];
        let item = itemProto.clone();
        item.find('a.accordion-menu__link').attr('href', page.pathName).addClass('app-page');
        item.find('.accordion-menu__icon > i').addClass(page.icon);
        item.find('.accordion-menu__name').text(page.title);
        items = items.add(item);
      }
      collapseContainer.append(items);
    } else {
      let item = itemProto.clone();
      item.find('a.accordion-menu__link').attr('href', section.pathName).addClass('app-page');
      item.find('.accordion-menu__icon > i').addClass(section.icon);
      item.find('.accordion-menu__name').text(section.title);
      containerElem.append(item);
    }
  }
  appSidebar.html = block.wrap('<div class="sidebar-container"></div>').parent();
}, toggleInsertSidebar = function () {
  if (!appSidebar.html) {
    createAppSidebar();
  }
  let sidebar = $(appRoot.sidebar);
  sidebar.empty().append(appSidebar.html);
  appSidebar.html.children().mScrollbar();
  updatePagesLinksBinds(sidebar);
};

let fakeDB = DEV_FAKE_SERVER ? require('./fakeDB') : undefined,
    loadContent = DEV_FAKE_SERVER ? fakeDB.loadContent : function(url, parser=(content)=>content) {}, // TODO: implement server and loader
    contentCache = {}, loadContentCached = function (url, parser=(content)=>content) {
  if (contentCache[url]) {
    return parser(contentCache[url]);
  }
  let contentNonParsed = loadContent(url, content => content);
  contentCache[url] = contentNonParsed;
  return parser(contentNonParsed);
};

let stylesRequire = [
  require('malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css'),
], importRequiredStyles = function() {
  if(document.getElementById('stylesRequire')) {
    return;
  }
  let stylesString = '';
  for(let req of stylesRequire) {
    stylesString += req.toString() + ' ';
  }
  $('head').append('<style id="stylesRequire">' + stylesString + '</style>');
}


let updateMainContentBinds = function () {
  let mainContent = $(appRoot.main);
  safeExec([
    () => $('.social', mainContent).socialIcon(),
    () => $('.bf-checkbox', mainContent).bfCheckbox(),
    () => $('.bf-radio', mainContent).bfRadio(),
    () => $('.bf-file-upload', mainContent).bfFileUpload(),
    () => $('.af-knob-dial', mainContent).afKnobDial(),
    () => $('.af-ion-rangeslider', mainContent).afIonRangeSlider(),
    () => $('.af-jquery-select', mainContent).jquerySelect({
      optionsContentLoader: (url) => loadContentCached(url, (content) => JSON.parse(content).query)}),
    () => $('input[data-inputMask]').afInputMask(),
    () => $('input.af-stripped-slider').strippedSlider(),
    () => $('.af-date-picker').afDatePicker(),
    () => $('.af-color-picker').afColorPicker(),
    () => $('.af-touch-spin').afTouchSpin(),
    () => $('.password-meter').afPasswordMeter(),
    () => $('#fileUpload, #fileUpload2').dragDropUpload(),
    () => $('#dualListBoxExample').dualListBox(),
    () => $('[data-toggle="dropdown"][data-popper-placement]').controlPopperPlacement(),
  ]);
}

$(function () {
  $('.no-js').hide();
  asyncGoToPage();
  toggleInsertHeader();
  toggleInsertSidebar();
  importRequiredStyles();
});
