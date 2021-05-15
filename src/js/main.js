
console.log('Hello world!');

const $ = window.$ = DEV_ENV === 'production' ? require('jquery/dist/jquery.min'): require('jquery');


const appTree = window.appTree = {
  homePage: {
    html: require('src/homePage.html'),
    title: 'Home',
  },
  additionalPage: {
    html: require('src/additionalPage.html'),
    title: 'Additional page',
  }
};
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
  return appTree[pageName] ? pageName : 'homePage';
}

let asyncGoToPage = function(pageName, goBack = false) {
  if (!pageName) {
    pageName = getAppLocation(window.location.pathname);
  }
  let page = appTree[pageName] || appTree.homePage;
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
    pageTitle.innerHTML = page.title;
  });
};

let updatePagesLinksBinds = function() {
  let onPageLinkClick = function(ev) {
    let location = new URL(ev.originalEvent.target.href);
    let pageName = getAppLocation(location.pathname);
    asyncGoToPage(pageName);
  };
  $('.app-page').on('click', (ev) => {ev.preventDefault(); onPageLinkClick(ev);});
};

window.addEventListener('popstate', function (ev) {
  if(!ev.target.location.hostname in ['localhost']) {
    return;
  }
  asyncGoToPage(getAppLocation(ev.target.location.pathname), true);
});

$(function () {
  $('.no-js').hide();
  asyncGoToPage();
});
