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
            popperElem.attr('style', 'transition: none !important');
            let top = (noCorrection)=>'0', left = (noCorrection)=>'0', px = '0', py = '0', [adjustV, adjustH] = (initiatorElem.attr('data-popper-placement')).split('-'),
                [ox, oy] = (initiatorElem.attr('data-popper-offset') || '0,0').split(',').map(v=>parseInt(v)),
                targetTransition = 'all ease .2s 0s', leftCorrection = 0, topCorrection = 0;
            switch(adjustH) {
              case 'left':
                left = (noCorrection) => (ox + (noCorrection ? 0 : leftCorrection)) + 'px';
                px = '-100%';
                break;
              case 'center':
                left = (noCorrection) => 'calc(50% + ' + (ox + (noCorrection ? 0 : leftCorrection)) + 'px)';
                px = '-50%';
                break;
              case 'right':
                left = (noCorrection) => 'calc(100% + ' + (ox + (noCorrection ? 0 : leftCorrection)) + 'px)';
                px = '0%';
                break;
            }
            switch (adjustV) {
              case 'top':
                top = (noCorrection) => (oy + (noCorrection ? 0 : topCorrection)) + 'px';
                py = '-100%';
                break;
              case 'middle':
                top = (noCorrection) => 'calc(50% + ' + (oy + (noCorrection ? 0 : topCorrection)) + 'px)';
                py = '-50%';
                break;
              case 'bottom':
                top = (noCorrection) => 'calc(100% + ' + (oy + (noCorrection ? 0 : topCorrection)) + 'px)';
                py = '0%';
                break;
            }
            let targetStyleState = (hidePopup, animation, stopTransition = true) => {
              return {
                //'transition': (stopTransition ? TRANSITION_STOP : targetTransition),
                'position': 'absolute',
                'top': top(animation),
                'left': left(animation),
                'transform': 'translate3d(calc(' + (px)
                  + '), calc(' + (py) + '), 0px)',
              };
            }
            /*
              adjust borders
             */
            popperElem.css(targetStyleState(false));
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
            let targetState = targetStyleState(false, false, false);
            popperElem.css(targetState);
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
