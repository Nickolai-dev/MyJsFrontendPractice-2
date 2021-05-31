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
      }
    };
    let [MenuMaterialHtml, MaterialMediaHtml] = Array.from($(require('../components/menu-material.html'))).map(v=>$(v));
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
      menuItem.mediaLabel.text(dataset.label);
      menuItem.mediaDate.text(dataset.date);
      typeof dataset.content === 'string' ? menuItem.mediaContent.text(dataset.content) : menuItem.mediaContent.append(dataset.content);
      return menuItem;
    }, createMessageItem = function(messageData) {
      return createMenuItem(adaptDataset(messageData, {
        'name': 'label',
        'avatar': 'image',
        'description': 'content'
      }));
    }, createNotificationItem = function (notificationData) {
      let notificationItem = createMenuItem(adaptDataset(notificationData, {}));
      notificationItem.mediaImg.after('')
      notificationItem.mediaImg.remove();
      delete notificationItem.mediaImg;
      return notificationItem;
    };
    let MMmethods = {
      init: function (options) {
        options = $.extend({}, defaults, options || {});
        $(this).each(function (i, b) {
          let block = $(b), isCentered = block.attr('data-center') === 'true', dataId = block.attr('data-id'),
              dataLabel = block.attr('data-label'), dataLabelMore = block.attr('data-labelMore'),
              dataLinkMore = block.attr('data-linkMore') || 'javascript:void(0)';
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
          menuContent.attr('id', dataId);
          menuContent.mScrollbar();
          if (options.content.type) {
            MMmethods.fillIn.call(menuContent[0], options);
          }
        });
      }, fillIn: function (options) {
        options = $.extend({}, defaults, options || {});
        $(this).each(function (i, b) {
          let menuContent = $(b), menuItemsToInsert = $([]),
            dataset = typeof options.content.data === 'function' ? options.content.data() : options.content.data;
          switch (options.content.type.toString().toLowerCase().replaceAll(' ', '-')) {
            case 'message':
            case 'messages': {
              for (let messageData of dataset) {
                let messageItem = createMessageItem(messageData);
                menuItemsToInsert = menuItemsToInsert.add(messageItem.block);
              }
              menuContent.append(menuItemsToInsert);
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
