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
    const TRANSITION_STOP = 'none';
    Popper.Defaults.onUpdate = Popper.Defaults.onCreate = function() {
      poppers.trigger('update.popperPlacementEvents');
    };
    return {
      init: function (options) {
        options = $.extend({}, defaults, options || {});
        $(this).each(function (i, b) {
          let initiatorElem = $(b), dataAnimation = initiatorElem.attr('data-popper-animation');
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
            popperElem.attr('style', 'visibility: hidden;')
            let top = ()=>'0', left = ()=>'0', px = '0', py = '0', [adjustV, adjustH] = (initiatorElem.attr('data-popper-placement')).split('-'),
                [ox, oy] = (initiatorElem.attr('data-popper-offset') || '0,0').split(',').map(v=>parseInt(v)),
                targetTransition = 'none', leftCorrection = 0, topCorrection = 0;
            switch(adjustH) {
              case 'left':
                left = () => (ox + leftCorrection) + 'px';
                px = '-100%';
                break;
              case 'center':
                left = () => 'calc(50% + ' + (ox + leftCorrection) + 'px)';
                px = '-50%';
                break;
              case 'right':
                left = () => 'calc(100% + ' + (ox + leftCorrection) + 'px)';
                px = '0';
                break;
            }
            switch (adjustV) {
              case 'top':
                top = () => (oy + topCorrection) + 'px';
                py = '-100%';
                break;
              case 'middle':
                top = () => 'calc(50% + ' + (oy + topCorrection) + 'px)';
                py = '-50%';
                break;
              case 'bottom':
                top = () => 'calc(100% + ' + (oy + topCorrection) + 'px)';
                py = '0';
                break;
            }
            let targetStyleState = (hidePopup) => 'transition: ' + targetTransition + '; position: absolute; top: ' + top()
              + '; left: ' + left() + '; transform: translate3d(' + px + ', ' + py + ', 0px);' + (hidePopup ? ' visibility: hidden;' : '');
            /*
              adjust borders
             */
            popperElem.attr('style', targetStyleState(true));
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
            popperElem.attr('style', targetStyleState());
          };
          popperElem.on('create.popperPlacementEvents update.popperPlacementEvents', adjustDropdown);
        });
      },
    }
  }());
  $.fn.extend({
      controlPopperPlacement: popperPlacement.init,
  });
}));
