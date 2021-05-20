
console.log('Hello world!');

const $ = window.$ = DEV_ENV === 'production' ? require('jquery/dist/jquery.min'): require('jquery');
require("bootstrap/js/src/util");
require("bootstrap/js/src/dropdown");
require("bootstrap/js/src/modal");
require("bootstrap/js/src/button");
require("bootstrap/js/src/tab");
require("bootstrap/js/src/collapse");

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
        html: import('src/app-pages/dual-list-box.html'),
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
  let pageName = /[^/]+$/.exec(urlpathname)[0];
  return appTree.find(pageName) ? pageName : 'homePage';
}

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

let appHeader = require('../header.html'), toggleInsertHeader = function () {
  appRoot.header.innerHTML = appHeader;
}
let appSidebar = window.appSidebar = {query: require('../components/app-sidebar.html')}, createAppSidebar = function() {
  let query = $(appSidebar.query), block = $(query[0]), containerElem = block.find('ul'),
      collapseProto = $(query[1]), itemProto = $(query[2]), accordionId = 'accordionMenu';
  containerElem.attr('id', accordionId);
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
        {'data-parent': '#' + accordionId, 'id': collapseId, 'aria-labelledby': collapseId + '_heading'});
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
  appSidebar.html = block[0].outerHTML;
}, toggleInsertSidebar = function () {
  if (!appSidebar.html) {
    createAppSidebar()
  }
  appRoot.sidebar.innerHTML = appSidebar.html;
  updatePagesLinksBinds($(appRoot.sidebar));
}

require('./basic-form-elements');
require('./advanced-form-elements');

let updateMainContentBinds = function () {
  let mainContent = $(appRoot.main);
  $('.social', mainContent).socialIcon();
  $('.bf-checkbox', mainContent).bfCheckbox();
  $('.bf-radio', mainContent).bfRadio();
  $('.bf-file-upload', mainContent).bfFileUpload();
  $('.af-knob-dial', mainContent).afKnobDial();
  $('.af-ion-rangeslider', mainContent).afIonRangeSlider();
  $('.af-jquery-select', mainContent).jquerySelect();
}

$(function () {
  $('.no-js').hide();
  asyncGoToPage();
  toggleInsertHeader();
  toggleInsertSidebar();
});
