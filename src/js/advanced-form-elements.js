
;
require('jquery-knob/dist/jquery.knob.min');
require('ion-rangeslider/js/ion.rangeSlider.min');
require('./jquery.jquery-simple-multiselect-plugin');
require('jquery-mask-plugin/dist/jquery.mask.min');
require('./jquery.stripped-slider');
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
        }, afInputMask: function () {
          let inputMasks = {
            'ISBN-1': {mask: '000-00-000-0000-0', options: {placeholder: '___-__-___-____-_', translation: {}, reverse: false}},
            'ISBN-2': {mask: '000 00 000 0000 0', options: {placeholder: '___ __ ___ ____ _', translation: {}, reverse: false}},
            'ISBN-3': {mask: '000/00/000/0000/0', options: {placeholder: '___/__/___/____/_', translation: {}, reverse: false}},
            'IPv4': {mask: '0ZZ.0ZZ.0ZZ.0ZZ', options: {placeholder: '___.___.___.___', translation: {'Z': {
              pattern: /[0-9]/, optional: true}}, reverse: false}},
            'Tax ID': {mask: '00-0000000', options: {placeholder: '__-_______', translation: {}, reverse: false}},
            'Phone': {mask: '(000) 000-0000', options: {placeholder: '(___) ___-____', translation: {}, reverse: false}},
            'Currency': {mask: '$ 000,000,000.00', options: {placeholder: '$ ___,___,___.__', translation: {}, reverse: false}},
            'Date': {mask: 'd0/m0/y000', options: {placeholder: '__/__/__', translation: {
                  'd': {pattern: /[1-3]/, optional: true},
                  'm': {pattern: /1/, optional: true},
                  'y': {pattern: /[12]/, optional: false},
                }, reverse: false}},
            'Postal Code': {mask: '99999', options: {placeholder: '_____', translation: {}, reverse: false}},
          }
          $(this).each(function (i, b) {
            let input = $(b), mask = input.attr('data-inputMask');
            delete inputMasks[mask].options.placeholder;
            inputMasks[mask].options.clearIfNotMatch = true;
            inputMasks[mask].options.selectOnFocus = true;
            input.mask(inputMasks[mask].mask, inputMasks[mask].options);
          });
        }
      }
    }());
    $.fn.extend({
      afKnobDial: afElements.afKnobDial,
      afIonRangeSlider: afElements.afIonRangeSlider,
      afInputMask: afElements.afInputMask,
    });
}));
