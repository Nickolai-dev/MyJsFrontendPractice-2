
;
require('jquery-knob/dist/jquery.knob.min');
require('ion-rangeslider/js/ion.rangeSlider.min');
require('./jquery.jquery-simple-multiselect-plugin');
let ionStyles = require("ion-rangeslider/css/ion.rangeSlider.min.css");

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
    let afElements = (function () {
      let importIonStyles = function () {
        if(document.getElementById('ionStyles')) {
          return;
        }
        $('head').append('<style id="ionStyles">' + ionStyles.default.toString() + '</style>');
      };
      let defaults = {};
      return {
        afKnobDial: function () {
          $(this).each(function (i, b) {
            let nativeInput = $(b), dataWidth = nativeInput.attr('data-width') || '85px', dataHeight = nativeInput.attr('data-height') || '85px';
            nativeInput.attr({'data-width': '100%', 'data-height': '100%'}).wrap('<div style="width: ' + dataWidth + ';height: ' + dataHeight + ';display:block; position:relative;"></div>');
            if (nativeInput.attr('data-readonly')) {
              nativeInput.css('pointer-events', 'none').removeAttr('data-readonly');
            }
            nativeInput.knob({'change': function (v) {}});
          });
        }, afIonRangeSlider: function () {
          importIonStyles();
          $(this).each(function(i, b) {
            let nativeInput = $(b);
            let opts = {};
            if(nativeInput.hasClass('range-slider-price')) {
              opts = {
                type: 'double',
                prefix: '$',
                max_postfix: '+'
              };
            } else if(nativeInput.hasClass('range-slider-carats')) {
              opts = {
                postfix: ' carats',
                grid_num: 4,
                step: .5
              }
            } else if (nativeInput.hasClass('range-slider-temperature')) {
              opts = {
                postfix: '°'
              }
            } else if (nativeInput.hasClass('range-slider-date')) {
              opts = {
                values: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
              }
            }
            nativeInput.ionRangeSlider($.extend(opts, {grid: true}))
          });
        }
      }
    }());
    $.fn.extend({
      afKnobDial: afElements.afKnobDial,
      afIonRangeSlider: afElements.afIonRangeSlider,
    });
}));
