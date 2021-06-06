;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
  let menuMaterial = (function () {
    let defaults = {
      content: {
        type: undefined,
        /**
         * @param data: [] | () => []
         */
        data: []
      },
      inline: false,
      dataId: undefined,
      enableScroll: true,
      tabNavId: undefined,
      tabPaneId: undefined,
    };
    let [MenuMaterialHtml, MaterialMediaHtml, TabNavContainer, TabListContainer] = Array.from($(require('../components/menu-material.html'))).map(v=>$(v));
    let adaptDataset = function(obj, rules) {
      let adapted = {};
      for(let key in obj) {
        adapted[rules.hasOwnProperty(key) ? rules[key] : key] = obj[key];
      }
      return adapted;
    }, createMenuItem = function(dataset) {
      let menuItem = {block: MaterialMediaHtml.clone()}
      menuItem.mediaImg = menuItem.block.find('.menu-material-media__media-img');
      menuItem.mediaBody = menuItem.block.find('.menu-material-media__media-body');
      menuItem.mediaHeading = menuItem.mediaBody.find('.menu-material-media__media-heading');
      menuItem.mediaContent = menuItem.mediaBody.find('.menu-material-media__media-content');
      menuItem.mediaLabel = menuItem.mediaHeading.find('.menu-material-media__name');
      menuItem.mediaDate = menuItem.mediaHeading.find('.menu-material-media__date');
      menuItem.mediaImg.attr('src', dataset.image);
      menuItem.mediaLabel.html(dataset.label);
      menuItem.mediaDate.html(dataset.date);
      typeof dataset.content === 'string' ? menuItem.mediaContent.html(dataset.content) : menuItem.mediaContent.append(dataset.content);
      return menuItem;
    }, createMessageItem = function(messageData) {
      return createMenuItem(adaptDataset(messageData, {
        'name': 'label',
        'avatar': 'image',
        'description': 'content'
      }));
    }, createNotificationItem = function (notificationData) {
      let notificationItem = createMenuItem(adaptDataset(notificationData, {
        'name': 'label',
        'short_descr': 'content',
      }));
      notificationItem.mediaImg.after('<span class="menu-material-media__media-icon"><i class="fa ' + {'success': 'fa-check', 'cloud-disk': 'fa-cloud', 'erase': 'fa-eraser', 'stonks': 'fa-line-chart'}[notificationData.type] + '"></i></span>');
      notificationItem.mediaIcon = notificationItem.mediaImg.next();
      notificationItem.mediaImg.remove();
      delete notificationItem.mediaImg;
      return notificationItem;
    }, createActivityItem = function(activityData) {
      let activityItem = createMenuItem(adaptDataset(activityData, {
        'action': 'label',
        'info': 'content'
      }));
      activityItem.mediaImg.remove();
      delete activityItem.mediaImg;
      activityItem.mediaBody.addClass('pl-0');
      activityItem.mediaHeading.addClass('h2');
      activityItem.mediaDate.css({'font-style': 'normal', 'font-weight': '400'});
      activityItem.mediaContent.addClass('mb-1');
      activityItem.block.addClass('mb-3');
      return activityItem;
    }, createSettingsItem = function(settingsData) {
      let id = settingsData.set.replace(' ', '-').toLowerCase();
      let settingsItem = {block: $('<div class="settings-form__item">\n' +
          '                        <label class="user-select-none settings-form__item-name h2 m-0" for="' + id + '">' + settingsData.set + '</label>\n' +
          '                        <input class="custom-checkbox" type="checkbox" name="' + id + '" id="' + id + '"' + (settingsData.val ? ' checked=""' : '') + '>\n' +
          '                      </div>')};
      return settingsItem;
    }, createNewsItem = function(newsData) {
      let newsItem = createMenuItem(adaptDataset(newsData, {
        'photo': 'image'
      }));
      newsItem.mediaLabel.remove();
      delete newsItem.mediaLabel;
      newsItem.mediaImg.css({'width': '60px', 'height': '60px'}).addClass('rounded-circle mr-3');
      newsItem.mediaDate.insertAfter(newsItem.mediaContent).css('font-style', 'normal');
      newsItem.mediaBody.addClass('pl-0 d-flex flex-column');
      newsItem.mediaContent.addClass('mb-1');
      newsItem.block.addClass('mb-3');
      return newsItem;
    };
    let MMmethods = {
      init: function (options) {
        options = $.extend({}, defaults, options || {});
        $(this).each(function (i, b) {
          let block = $(b), isCentered = block.attr('data-center') === 'true', dataId = block.attr('data-id') || options.dataId,
              dataLabel = block.attr('data-label'), dataLabelMore = block.attr('data-labelMore'),
              dataLinkMore = block.attr('data-linkMore') || 'javascript:void(0)',
              dataEnableScroll = ['true', undefined, true].indexOf(block.attr('data-scroll') || options.enableScroll) > -1;
          if(block.children().length > 0) {
            return;
          }
          block.on('click', ev => ev.stopPropagation());
          block.addClass('menu-material' + (isCentered ? ' menu-material_center' : ''))
            .append(MenuMaterialHtml.children().clone());
          let menuHeading = block.find('.menu-material__heading'), menuHeadingText = menuHeading.find('span'),
              menuWrapper = block.find('.menu-material__wrapper'), menuContainer = menuWrapper.find('.menu-material__container'),
              menuContent = menuContainer.find('.menu-material__content'), menuBottomButton = block.find('.menu-material__bottom-btn'),
              menuMoreLink = menuBottomButton.find('a');
          menuHeadingText.text(dataLabel);
          if(!dataLabel) {
            menuHeading.remove();
          }
          menuMoreLink.attr('href', dataLinkMore);
          menuMoreLink.text(dataLabelMore);
          if(!dataLabelMore) {
            menuBottomButton.remove();
          }
          if (options.inline || block.attr('data-inline')) {
            menuContent.addClass('p-0');
            block.css({'box-shadow': 'none', 'width': '100%'});
          }
          menuContent.attr('id', dataId);
          block.attr('data-height-auto') !== undefined ? menuContainer.addClass('h-auto') : 0;
          options.content.type ? MMmethods.fillIn.call(menuContent[0], options) : 0;
          dataEnableScroll ? menuContent.mScrollbar() : 0;
        });
      }, fillIn: function (options) {
        options = $.extend({}, defaults, options || {});
        $(this).each(function (i, b) {
          let menuContent = $(b), menuItemsToInsert = $([]),
            dataset = typeof options.content.data === 'function' ? options.content.data() : options.content.data,
            itemType = options.content.type.toString().toLowerCase().replaceAll(' ', '-');
          switch (itemType) {
            case 'notifications':
            case 'news':
            case 'activities':
            case 'settings':
            case 'messages': {
              switch (itemType) {
                case 'news': {
                  menuContent.append('<div class="tabs-material-content__heading h2 d-flex"><i class="fa fa-comments-o mr-1"></i>Latest News</div><p class="tabs-material-content__info">You have <span id="recent-news-count"></span> new news</p>');
                  let recentNewsCounter = menuContent.find('#recent-news-count');
                  recentNewsCounter.text(dataset.length);
                  break;
                }
                case 'activities': {
                  menuContent.append('<div class="tabs-material-content__heading h2 d-flex"><i class="fa fa-cube mr-1"></i>Recent Activity</div><p class="tabs-material-content__info">You have <span id="recent-activity-count"></span> recent activities</p>');
                  let recentActivityCounter = menuContent.find('#recent-activity-count');
                  recentActivityCounter.text(dataset.length);
                  break;
                }
                case 'settings': {
                  menuContent.append('<div class="tabs-material-content__heading h2 d-flex"><i class="fa fa-cube mr-1"></i>Settings Panel</div>');
                  break;
                }
              }
              for (let itemData of dataset) {
                let item = {
                  'messages': createMessageItem,
                  'notifications': createNotificationItem,
                  'activities': createActivityItem,
                  'settings': createSettingsItem,
                  'news': createNewsItem,
                }[itemType](itemData);
                menuItemsToInsert = menuItemsToInsert.add(item.block);
              }
              menuContent.append(menuItemsToInsert);
              break;
            }
            case 'tab':
            case 'tabs': {
              menuContent.css('padding', '20px');
              let tabNavContainer = TabNavContainer.clone().empty(), tabListContainer = TabListContainer.clone().empty();
              for (let tabData of dataset.query) {
                tabData = $.extend({}, defaults, tabData || {});
                let tabNav = TabNavContainer.children().clone(), tabPane = TabListContainer.children().clone(),
                    tabNavId = tabData.tabNavId || (tabData.label.toLowerCase() + '-tab'),
                    tabPaneId = tabData.tabPaneId || (tabData.label.toLowerCase() + '-tabPane');
                tabNav.children('a').html(tabData.label).on('click', ev => {
                  ev.preventDefault();
                  $(ev.target).tab('show');
                }).attr({
                  'href': '#' + tabPaneId,
                  'id': tabNavId,
                  'aria-controls': tabPaneId
                });
                tabNavContainer.append(tabNav);
                tabPane.attr({
                  'id': tabPaneId,
                  'aria-labelledby': tabNavId
                });
                if (tabData.content.type) {
                  lazyExec(() => tabPane.menuMaterial($.extend({}, tabData, {inline: true, enableScroll: false})));
                }
                tabListContainer.append(tabPane);
              }
              menuItemsToInsert = menuItemsToInsert.add(tabNavContainer).add(tabListContainer);
              menuContent.append(menuItemsToInsert);
              let insertScrollbarOnClick = function() {
                let pane = $($(this).attr('href'));
                if(pane.data('has scrollbar')) {
                  return;
                }
                if(pane.is('.active')) {
                  pane.find('.menu-material__content').mScrollbar({outside: true});
                } else {
                  setTimeout(() => insertScrollbarOnClick.call(this), 30);
                }
              };
              tabNavContainer.find('li a').one('click', insertScrollbarOnClick);
              tabNavContainer.find('li:first-child() a').trigger('click');
              break;
            }
          }
        });
      }
    };
    return MMmethods;
  }());
  $.fn.extend({
    menuMaterial: menuMaterial.init,
    menuMaterialFillIn: menuMaterial.fillIn,
  });
}));
