;
let Popper = window.Popper = require('popper.js').default;
(function (factory) {
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
  let popperPlacement = (function () {
    let defaults = {
      boundary: $('html')[0],
    }, poppers = $([]); // possible memory leak
    const TRANSITION_STOP = 'none !important';
    Popper.Defaults.onUpdate = Popper.Defaults.onCreate = function() {
      poppers.trigger('update.popperPlacementEvents');
    };
    return {
      init: function (options) {
        options = $.extend({}, defaults, options || {});
        $(this).each(function (i, b) {
          let initiatorElem = $(b), dataPopperOffset = (initiatorElem.attr('data-popper-offset') || '0,0'),
              dataPopperPlacement = initiatorElem.attr('data-popper-placement').split(' '), popperPlacement = dataPopperPlacement[0],
              popperAnchor = dataPopperPlacement.length > 1 ? dataPopperPlacement[1] : popperPlacement;
          /**
           * implemented for bootstrap4 dropdown; these dropdowns are always placed next to the initiator element
           */
          let popperElem = initiatorElem.nextAll().filter('.dropdown-menu');
          if (!popperElem.length) {
            console.error('no dropdown found');
            return;
          }
          popperElem = $(popperElem[0]);
          poppers = poppers.add(popperElem);
          let adjustDropdown = function() {
            if (popperElem.css('will-change') !== 'transform') {
              return;
            }
            let anchorTable = {'left': -1, 'center': -.5, 'right': 0, 'top': -1, 'middle': -.5, 'bottom': 0},
                [adjustV, adjustH] = popperPlacement.split('-'),
                [anchorV, anchorH] = popperAnchor.split('-'),
                px = anchorTable[adjustH], py = anchorTable[adjustV],
                ax = anchorTable[anchorH], ay = anchorTable[anchorV],
                leftCorrection = 0, topCorrection = 0,
                [ox, oy] = dataPopperOffset.split(',').map(v=>parseInt(v)),
                top = () => 'calc(' + (100*(1.0+ay)) + '% + ' + (oy + topCorrection + popperElem.outerHeight() * py) + 'px)',
                left = () => 'calc(' + (100*(1.0+ax)) + '% + ' + (ox + leftCorrection + popperElem.outerWidth() * px) + 'px)';
            let targetStyleState = () => {
              return {
                'position': 'absolute',
                'top': top(),
                'left': left(),
              };
            }
            /*
              adjust borders
             */
            popperElem.css(targetStyleState());
            let popperRect = popperElem[0].getBoundingClientRect(),
                parentRect =  options.boundary.getBoundingClientRect(),
                mvLeft = popperRect.right - parentRect.right,
                mvRight = parentRect.left - popperRect.left,
                mvBottom = parentRect.top - popperRect.top,
                mvTop = popperRect.bottom - parentRect.bottom;
            if(mvRight >= 0) {
              leftCorrection = mvRight;
            } else if (mvLeft > 0) {
              leftCorrection = -mvLeft;
            }
            if (mvBottom >= 0) {
              topCorrection = mvBottom;
            } else if (mvTop > 0) {
              topCorrection = -mvTop;
            }
            /*
             */
            popperElem.attr('style', '');
            popperElem.css(targetStyleState());
          };
          popperElem.on('create.popperPlacementEvents update.popperPlacementEvents', adjustDropdown);
        });
      }, reset: function () {
        $(this).each(function (i, b) {
          $(b).nextAll().filter('.dropdown-menu').off('create.popperPlacementEvents update.popperPlacementEvents');
        });
      }
    }
  }());
  $.fn.extend({
    controlPopperPlacement: popperPlacement.init,
    resetControlPopperPlacement: popperPlacement.reset,
  });
}));
