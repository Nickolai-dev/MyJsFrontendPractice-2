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
    let defaults = {},
      poppers = $([]); // possible memory leak
    const TRANSITION_STOP = 'transform linear 0s 0s';
    Popper.Defaults.onUpdate = Popper.Defaults.onCreate = function() {
      poppers.trigger('update.popperPlacementEvents');
    };
    let checkDropdown = function(popperElem) {
      return popperElem.css('transform') !== undefined;
    };
    async function wait(ms) {
      let lock = true;
      setTimeout(() => lock = false, ms);
      await new Promise(resolve => {
        while (lock) {}
        resolve();
      });
    }
    return {
      init: function (options) {
        options = $.extend({}, defaults, options || {});
        $(this).each(function (i, b) {
          let initiatorElem = $(b), dataPlacement = initiatorElem.attr('data-popper-placement'),
              dataTransition = initiatorElem.attr('data-popper-transition'), dataOffset = initiatorElem.attr('data-popper-offset') || '0,0';
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
          async function waitForDropdown() {
            let dropdownShown = checkDropdown(popperElem), timeoutBreaker = 0;
            while (!dropdownShown) {
              await wait(30);
              timeoutBreaker+=30;
              dropdownShown = checkDropdown(popperElem);
              if(timeoutBreaker > 2000) {
                break;
              }
            }
          }
          let adjustDropdown = function() {
            if (popperElem.css('will-change') !== 'transform') {
              return;
            }
            popperElem.attr('style', '');
            let top = 0, left = 0, px = 0, py = 0, [adjustV, adjustH] = initiatorElem.attr('data-popper-placement').split('-'),
                [ox, oy] = initiatorElem.attr('data-popper-offset').split(',').map(v=>parseInt(v));
            switch(adjustH) {
              case 'left':
                left = ox + 'px';
                px = '-100%';
                break;
              case 'center':
                left = 'calc(50% + ' + ox + 'px)';
                px = '-50%';
                break;
              case 'right':
                left = 'calc(100% + ' + ox + 'px)';
                px = '0';
                break;
            }
            switch (adjustV) {
              case 'top':
                top = oy + 'px';
                py = '-100%';
                break;
              case 'middle':
                top = 'calc(50% + ' + oy + 'px)';
                py = '-50%';
                break;
              case 'bottom':
                top = 'calc(100% + ' + oy + 'px)';
                py = '0';
                break;
            }
            popperElem.attr('style' , 'transition: ' + TRANSITION_STOP + '; position: absolute; top: ' + top
              + '; left: ' + left + '; transform: translate3d(' + px + ', ' + py + ', 0px);');
          };
          //initiatorElem.on('click', ev => waitForDropdown().then(() => adjustDropdown()));
          popperElem.on('create.popperPlacementEvents update.popperPlacementEvents', adjustDropdown);
        });
      },
    }
  }());
  $.fn.extend({
      controlPopperPlacement: popperPlacement.init,
  });
}));
