
;
require('jquery-knob/dist/jquery.knob.min');
require('ion-rangeslider/js/ion.rangeSlider.min');
require('./jquery.jquery-simple-multiselect-plugin');
require('jquery-mask-plugin/dist/jquery.mask.min');
require('./jquery.stripped-slider');
require('bootstrap-datepicker/dist/js/bootstrap-datepicker.min');
require('jquery-colpick/js/colpick');
let ionStyles = require('ion-rangeslider/css/ion.rangeSlider.min.css');
let colpickStyles = require('jquery-colpick/css/colpick.css');

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
      let importAnotherStyles = function () {
        if(document.getElementById('anotherStyles')) {
          return;
        }
        $('head').append('<style id="anotherStyles">' + ionStyles.default.toString() + ' ' + colpickStyles.default.toString() + '</style>');
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
          importAnotherStyles();
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
        }, afDatePicker: function () {
          $(this).each(function (i, b) {
            let block = $(b), range = (block.attr('data-range') === 'true'), input = block.find('.date-picker__input'),
                startView = parseInt(block.attr('data-start-view')), endView = parseInt(block.attr('data-end-view'));
            block.addClass('date-picker');
            if(!range) {
              input.datepicker({
                format: endView > 0 ? endView > 1 ? 'yy' : 'mm/yy' : 'dd/mm/yy',
                startView: startView,
                minViewMode: endView,
                todayBtn: 'linked',
                autoclose: true
              });
            } else {
              block.datepicker({
                format: 'dd/mm/yy',
                todayBtn: 'linked',
                autoclose: true
              });
            }
          });
        }, afColorPicker: function () {
          $(this).each(function(i, b) {
            let input = $(b), dataType = input.attr('data-type');
            input.wrap('<div class="color-picker"><div class="input-group"></div></div>')
              .addClass('color-picker__input').after(
                '<div class="input-group-append">\n' +
                  '<button class="color-picker__btn">\n' +
                    '<span class="color-picker__preview"></span>\n' +
                  '</button>\n' +
                '</div>').attr('onClick', 'this.setSelectionRange(0, this.value.length); document.execCommand(\'copy\');');
            let block = input.parents('.color-picker'), button = block.find('.color-picker__btn'),
                preview = block.find('.color-picker__preview');
            block.append('<i class="color-picker__copied-icon" style="display: none;"></i>');
            let copiedIcon = block.find('.color-picker__copied-icon');
            input.on('click', (ev)=>copiedIcon.fadeIn().delay(800).fadeOut());
            let picker, doc = $(document), alphaBar, currentX, handle, percentValue;
            let parseColor = function(str, change = false) {
              let col = '#000000', match = str.match(/(?<hex>\#(?<hex_val>[0-9a-fA-F]{6})(?<hex_a>[0-9a-fA-F]{2})?)|(?<rgb>rgba?\ ?\((?<rgb_r>\d{1,3}),\ ?(?<rgb_g>\d{1,3}),\ ?(?<rgb_b>\d{1,3})(:?,\ ?(?<rgb_a>\d(:?\.\d\d?)?)?\))?)|(?<hsb>hsb\ ?\((?<hsb_h>\d{1,3}),\ ?(?<hsb_s>\d{1,3}),\ ?(?<hsb_b>\d{1,3})(:?,\ ?(?<hsb_a>\d{1,3})\%)?\))/);
              if (match === null) {
                return col;
              }
              let groups = match.groups;
              if (groups.hex !== undefined) {
                col = groups.hex_val;
                if (change) {percentValue = Math.round(parseInt(groups.hex_a || 'ff', 16) / 255 * 100);}
              } else if (groups.rgb !== undefined) {
                col = {r: groups.rgb_r, g: groups.rgb_g, b: groups.rgb_b};
                if (change) {percentValue = groups.rgb_a === undefined ? 100 : Math.round(groups.rgb_a * 100);}
              } else if (groups.hsb !== undefined) {
                col = {h: groups.hsb_h, s: groups.hsb_s, b: groups.hsb_b};
                if (change) {percentValue = groups.hsb_a === undefined ? 100 : groups.hsb_a;}
              }
              return col;
            };
            let move = function(ev) {
              let barWidth = alphaBar.innerWidth();
              if (ev !== null) {
                currentX = ev.pageX - alphaBar.offset().left;
              } else {
                parseColor(input.val(), true);
                currentX = barWidth * percentValue / 100;
              }
              currentX = currentX > 0 ? currentX < barWidth ? Math.round(currentX / barWidth * 100) * barWidth / 100 : barWidth : 0;
              percentValue = Math.round(currentX / barWidth * 100);
              handle.css('left', currentX);
              button.colpickSetColor(parseColor(input.val()));
            };
            let extendPicker = function() {
              picker.css({
                height: '185px'
              }).append('<div class="colpick-alfa"><div class="colpick-alfa__handle"></div></div>')
                .find('.colpick_new_color, .colpick_hex_field').hide();
              alphaBar = picker.find('.colpick-alfa');
              handle = alphaBar.find('.colpick-alfa__handle');
              currentX = alphaBar.innerWidth();
              alphaBar.on('mousedown', function(ev) {
                ev.stopPropagation();
                move(ev);
                doc.on('mousemove.activeColorPickerAlphaBar', move)
                  .on('mouseup.activeColorPickerAlphaBar',
                    () => doc.off('mousemove.activeColorPickerAlphaBar mouseup.activeColorPickerAlphaBar'));
              });
            }
            button.colpick({
              submit: false,
              layout: 'hex',
              onChange: function(hsb, hex, rgb, el, setByColor) {
                let val = 0, pcol = 'rgb' + (percentValue < 100 ? 'a' : '') + '(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + (percentValue < 100 ? ', ' + percentValue / 100 : '') + ')',
                    pcolSolid = 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 1)',
                    pcolAlpha = 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0)';
                switch (dataType) {
                  case 'hex':
                  case undefined:
                    let al = Math.round(255 / 100 * percentValue).toString(16);
                    val = '#' + hex + (percentValue < 100 ? (al.length < 2 ? al + '0' : al) : '');
                    break;
                  case 'rgb':
                    val = pcol;
                    break;
                  case 'hsb':
                    val = 'hsb(' + hsb.h + ', ' + hsb.s + ', ' + hsb.b + (percentValue < 100 ? ', ' + percentValue + '%' : '') + ')';
                    break;
                }
                preview.css('background', 'linear-gradient(' + pcol + ', ' + pcol + '), ' + 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==)');
                if (alphaBar !== undefined) { alphaBar.css({'background':
                    'linear-gradient(90deg, ' + pcolAlpha + ', ' + pcolSolid + '), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==)'});}
                input.val(val);
              },
              onBeforeShow: function (b) {
                picker = $(b);
                if (picker.data('extended') === true) {
                  return;
                }
                picker.data('extended', true);
                extendPicker();
                move(null);
              }
            }).colpickSetColor(parseColor(input.val(), true));
          });
        }, afTouchSpin: function () {
          $(this).each(function(i, b) {
            let input = $(b), block = input.wrap('<div class="touch-spin"><div class="input-group"></div></div>')
                  .addClass('touch-spin__input').parents('.touch-spin'),
                isVertical = input.attr('data-vertical') !== undefined, dataPostfix = input.attr('data-postfix'),
                min = input.attr('min'), max = input.attr('max'), step = parseFloat(input.attr('step') || 1), doc = $(document),
                delayForSpinBegin = 800, minDelayBetweenTicks = 25, maxDelayBetweenTicks = 150, ticksAcceleration = 10;
            min = min === undefined ? undefined : parseInt(min);
            max = max === undefined ? undefined : parseInt(max);
            if (!isVertical) {
              input.before('<button class="touch-spin__larr"></button>').after('<button class="touch-spin__rarr"></button>');
            } else {
              input.after('<div class="touch-spin__rblock"><a class="touch-spin__rarr"></a><a class="touch-spin__larr"></a></div>');
            }
            if (dataPostfix !== undefined) {
              input.after('<span class="touch-spin__postfix">' + dataPostfix + '</span>');
            }
            let arrs = block.find('.touch-spin__larr, .touch-spin__rarr'), timer;
            let get = function() {
              return parseFloat(input.val()) || 0;
            };
            let set = function(v) {
              let val = (min === undefined || v >= min) ? (max === undefined || v <= max) ? v : max : min,
                  normalizedVal = Math.round(val / step) * step;
              input.val(normalizedVal.toString().match(/\-?\d+(?:\.\d\d?)?/)[0]);
              return val === v;
            };
            let inc = function(a) {
              return set(get() + (a.is('.touch-spin__rarr') ? step : -step));
            };
            let timerFunc = function(ev, thisInc = undefined, delay = maxDelayBetweenTicks) {
              let lasts = true;
              if (thisInc === undefined) {
                lasts = false;
                thisInc = ()=>inc($(this));
              }
              if (thisInc()) {
                delay = delay - ticksAcceleration < minDelayBetweenTicks ? minDelayBetweenTicks : delay - ticksAcceleration;
                timer = setTimeout(() => timerFunc(ev, thisInc, delay), lasts ? delay : delayForSpinBegin);
              }
            };
            arrs.on('mousedown', timerFunc);
            doc.on('mouseup.spinToWin', () => clearInterval(timer));
          });
        }, afPasswordMeter: function () {
          $(this).each(function (i, b) {
            let block = $(b), onlyStrength = block.attr('data-onlyStrength') !== undefined,
                assocUsername = block.attr('data-username'), assocDate = block.attr('data-date'), assocPassword = block.attr('data-password');
            assocDate = assocDate === undefined ? undefined : $(assocDate);
            assocUsername = assocUsername === undefined ? undefined : $(assocUsername);
            assocPassword = assocPassword === undefined ? undefined : $(assocPassword);
            if (block.find('.password-meter__progress').length === 0) {
              block.append('<div class="password-meter__progress"></div>'); }
            let progress = block.find('.password-meter__progress');
            if (onlyStrength) {
              block.addClass('password-meter_only-strength');
            }
            const regSpecialSumbols = /[\!\"\#\$\%\&\'\(\)\*\+,\-\./\\\:;\<\=\>\?\@\[\]\^_\`\{\|\}\~]/g,
                  regNumbers = /\d/g;
            let xIndex = function (str1, str2, variate = false) {
              if (variate) {
                for (let i = 0; i < str2.length; i++) {
                  let reg = new RegExp(str2.substring(0, -2 + i) + '.?.?' + str2.substring(i, str2.length));
                  if (str1.match(reg)) {
                    return str2;
                  }
                }
              } else {
                return str1.match(str2) === null ? 0 : 1;
              }
            };
            let calcStrength = function () {
              let val = assocPassword.val(), name = assocUsername === undefined ? undefined : assocUsername.val(),
                  date = assocDate === undefined ? undefined : assocDate.val(),
                  specNum = val.match(regSpecialSumbols), numNum = val.match(regNumbers);
              specNum = specNum === null ? 0 : specNum.length;
              numNum = numNum === null ? 0 : numNum.length;
              let strength = val.length / 20 * 100 +
                (specNum > 0 ? specNum > 1 ? specNum > 2 ? 30 : 20 : 10 : 0) +
                (numNum > 0 ? numNum > 1 ? 20 : 10 : 0);
              if (date !== undefined) {
                for (let i = 0, dp = date.split('/'); i < dp.length; i++) {
                  strength -= xIndex(val, dp[i]) * 20;
                }
              }
              if (name !== undefined) {
                strength -= xIndex(val, name, false) * 50;
              }
              return strength;
            };
            let setState = function (state) {
              let states = ['weak', 'normal', 'medium', 'strong', 'very-strong'];
              for (let i = 0; i < states.length; i++) {
                block.removeClass('password-meter_' + states[i]);
              }
              block.addClass('password-meter_' + state);
            };
            let updateVerdict = function () {
              let strength = calcStrength(), val = strength >= 0 ? strength <= 100 ? strength : 100 : 0;
              progress.css('width', val + '%');
              if (strength <= 25) {
                setState('very-weak');
              } else if (strength < 35) {
                setState('weak');
              } else if (strength < 55) {
                setState('normal');
              } else if (strength < 80) {
                setState('medium');
              } else if (strength < 100) {
                setState('strong')
              } else if (strength >= 100) {
                setState('very-strong');
              }
            };
            updateVerdict();
            assocPassword.on('keyup', (ev) => updateVerdict());
            if (assocUsername !== undefined) {
              assocUsername.on('change', (ev) => updateVerdict());
            }
            if (assocDate !== undefined) {
              assocDate.on('change', (ev) => updateVerdict());
            }
          });
        }
      }
    }());
    $.fn.extend({
      afKnobDial: afElements.afKnobDial,
      afIonRangeSlider: afElements.afIonRangeSlider,
      afInputMask: afElements.afInputMask,
      afDatePicker: afElements.afDatePicker,
      afColorPicker: afElements.afColorPicker,
      afTouchSpin: afElements.afTouchSpin,
      afPasswordMeter: afElements.afPasswordMeter,
    });
}));
