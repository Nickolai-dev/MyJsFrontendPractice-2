

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
  let bfElements = (function() {
    let cloneAll = function (obj) {
      let clone = {};
      for(let key in obj) {
        clone[key] = (typeof obj[key] === 'string' ? $(obj[key]) : obj[key]).clone();
      }
      return clone;
    };
    let findNearby = function(selector, elem, parentLevel = 2) {
      let context = elem;
      for(let i = 0; i < parentLevel; i++) {
        context = context.parent();
        let res = context.find(selector);
        if (res.length > 0) {
          return res;
        }
      }
      return $(selector);
    }
    let defaults = {},
      socialDict = {
      dict: [{
        test: /facebook/i,
        title: 'Facebook',
        classPrefix: 'facebook',
        faIcon: 'fa-facebook',
        href: 'https://www.facebook.com',
      }, {
        test: /linkedin/i,
        title: 'LinkedIn',
        classPrefix: 'linkedin',
        faIcon: 'fa-linkedin',
        href: 'https://linkedin.com',
      }, {
        test: /twitter/i,
        title: 'Twitter',
        classPrefix: 'twitter',
        faIcon: 'fa-twitter',
        href: 'https://www.twitter.com',
      }, {
        test: /google(?:(?:\-?plus)|(?:\+))/i,
        title: 'Google+',
        classPrefix: 'google-plus',
        faIcon: 'fa-google-plus',
        href: 'https://www.google.plus.com',
      }],
      elements: {
        raw: '<span class="social__iwrap"><i class="social__icon fa"></i></span><span class="social__text"></span>'
      }
    };
    socialDict.get = function (expr) {
      for (let i = 0; i < socialDict.dict.length; i++) {
        if (socialDict.dict[i].test.test(expr)) {
          return socialDict.dict[i];
        }
      }
      return socialDict.dict[0];
    };
    socialDict.getClonedElements = function () {
      return $(socialDict.elements.raw);
    };
    return {
      socialIcon: function (options) {
        options = $.extend({}, defaults, options || {});
        let this__ = $(this);
        for(let i = 0; i < this__.length; i++) {
          let this_ = $(this__[i]);
          if (!this_.is(':empty')) {
            return;
          }
          let thisSocial = socialDict.get(this_.attr('class')), elems = socialDict.getClonedElements();
          this_.append(elems);
          elems.find('i').addClass(thisSocial.faIcon);
          elems.filter('.social__text').text(thisSocial.title);
          if(this_.is('a')) {
            this_.attr('href', thisSocial.href);
          }
        }
      }, checkbox: function () {
        $(this).each(function (i, b) {
          let nativeInput = $(b),
              preChecked = (nativeInput.attr('checked') !== undefined) || nativeInput.prop('checked'),
              disabled = nativeInput.attr('disabled') !== undefined, value = preChecked,
              associatedLabel = findNearby('label[for="' + nativeInput.attr('id') + '"]', nativeInput, 3);
          nativeInput.addClass('basic-login-form__checkbox-check').wrap('<div class="basic-login-form__checkbox"></div>');
          let block = nativeInput.parent();
          nativeInput.on('check.basicForm', function () {
            value = true;
            nativeInput.prop('checked', true);
            block.addClass('basic-login-form__checkbox_checked');
          }).on('uncheck.basicForm', function () {
            value = false;
            nativeInput.prop('checked', false);
            block.removeClass('basic-login-form__checkbox_checked');
          }).on('disable.basicForm', function () {
            disabled = true;
            nativeInput.attr('disabled', '');
            block.addClass('basic-login-form__checkbox_disabled');
          }).on('enable.basicForm', function () {
            disabled = false;
            nativeInput.removeAttr('disabled');
            block.removeClass('basic-login-form__checkbox_disabled');
          });
          if (preChecked) {
            nativeInput.trigger('check');
          }
          if (disabled) {
            nativeInput.trigger('disable')
          }
          associatedLabel.add(block).on('mouseenter mouseleave', () => {
            if(disabled) {
              return;
            }
            block.toggleClass('basic-login-form__checkbox_hover');
          });
          block.on('click', () => {
            if(disabled) {
              return;
            }
            nativeInput.trigger(value ? 'uncheck' : 'check');
          });
        });
      }, radio: function () {
        $(this).each(function(i, b) {
          let nativeInput = $(b),
              associatedLabel = findNearby('label[for="' + nativeInput.attr('id') + '"]', nativeInput, 3);
          nativeInput.addClass('basic-login-form__radio-radio').wrap('<div class="basic-login-form__radio"></div>');
          let block = nativeInput.parent();
          nativeInput.on('check.basicForm', function () {
            let group = findNearby(
                'input[type="radio"][name="'+ nativeInput.attr('name') +'"][id!=' + nativeInput.attr('id') + ']',
                nativeInput, 3).filter('[value!="'+nativeInput.attr('value')+'"]');
            group.prop('checked', false).parents('.basic-login-form__radio').removeClass('basic-login-form__radio_checked');
            block.addClass('basic-login-form__radio_checked');
            nativeInput.prop('checked', true);
          }).on('enable.basicForm', () => {
            nativeInput.removeAttr('disabled');
            block.removeClass('basic-login-form__radio_disabled').data('disabled', false);
          }).on('disable.basicForm', () => {
              nativeInput.attr('disabled', '');
              block.addClass('basic-login-form__radio_disabled').data('disabled', true);
          });
          if (nativeInput.attr('checked') !== undefined) {
            nativeInput.trigger('check');
          }
          if (nativeInput.attr('disabled') !== undefined) {
            nativeInput.trigger('disable');
          }
          associatedLabel.add(block).on('mouseenter mouseleave', () => {
            if (nativeInput.trigger('disabled')) {
              return;
            }
            block.toggleClass('basic-login-form__radio_hover');
          }).on('click', () => {
            if (nativeInput.attr('disabled') !== undefined) {
              return;
            }
            nativeInput.trigger('check');
          });
        });
      }, fileUpload: function () {
        $(this).each(function(i, b) {
          let nativeInput = $(b);
          nativeInput.addClass('basic-login-form__file-upload-input')
            .wrap('<div class="basic-login-form__file-upload"></div>')
            .attr('onchange', 'document.getElementById("' + nativeInput.attr('id') + '_text' + '").value = this.value;');
          let block = nativeInput.parent();
          block.append('<input type="text" class="basic-login-form__input" id="' + nativeInput.attr('id') + '_text' + '" name="' + nativeInput.attr('name') + '_text' + '">');
          if (nativeInput.attr('data-icon') === 'true') {
            nativeInput.after('<i class="fa fa-upload basic-login-form__file-upload-icon"></i>');
          }
          nativeInput.wrap('<div class="basic-login-form__file-upload-button btn btn-material-red btn-material-red_simple overflow-hidden"></div>').after('Browse');
        });
      }
    }
  }());
  $.fn.extend({
    socialIcon: bfElements.socialIcon,
    bfCheckbox: bfElements.checkbox,
    bfRadio: bfElements.radio,
    bfFileUpload: bfElements.fileUpload,
  });
}));
