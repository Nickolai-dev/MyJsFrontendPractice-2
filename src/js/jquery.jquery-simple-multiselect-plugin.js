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
  let jqueryMultiselect = (function () {
    let defaults = {};
    return {
      select: function (options) {
        options = $.extend({}, defaults, options || {});
        $(this).each(function (i, b) {
          let nativeSelect = $(b), multiple = nativeSelect.attr('multiple') !== undefined;

          let change = function(option) {
            placeholder.text(option.text());
            nativeSelect.val(option.attr('value'));
            drop.trigger('mypopups.hide');
          };
          let addOption = function(option) {
            let b = badge.clone(), cl = btnClose.clone(), nativeOption = nativeOptions.filter(function(i, op) {return op.value === option.attr('data-value')});
            nativeOption.prop('selected', true);
            b.text(option.text());
            b.on('click', ev => ev.stopPropagation()).append(cl);
            cl.on('click', (ev) => {ev.stopPropagation(); removeOption(b, nativeOption)});
            option.hide();
            container.append(b);
            updatePlaceholder();
          };
          let removeOption = function(badge, nativeOption) {
            nativeOption.prop('selected', false);
            badge.remove();
            updatePlaceholder();
            search();
          };
          let updateScroll = function() {
            if (menu.outerHeight > 240) {
              scroll.css('overflow-y', 'scroll');
            } else {
              scroll.css('overflow-y', 'auto');
            }
          };
          let updatePlaceholder = function() {
            if (container.has('.my-custom-select__badge').length === 0) {
              placeholder.show();
            } else {
              placeholder.hide();
            }
          }
          let search = function () {
            let searchValue = searchInput.val(), filteredOptions = nativeOptions.filter(function (i, op) {
                  return new RegExp(searchValue + '.*', 'gi').test(op.innerHTML);
                }), listToShow = $([]), clonableObject = $('<li class="list-group-item list-group-item-action my-custom-select__option">option</li>');
            filteredOptions.each(function(i, op) {
              let obj = clonableObject.clone();
              obj.text(op.innerHTML);
              if ($(op).prop('selected') !== true) {
                listToShow = listToShow.add(obj);
              }
            });
            if (listToShow.length === 0) {
              listToShow = $('<li class="list-group-item list-group-item-action my-custom-select__option disabled">Nothing to show</li>');
            }
            menu.empty().append(listToShow);
            updateScroll();
          };
          drop.hide();
          drop.on('mypopups.hide', function (ev) {
            block.removeClass('my-custom-select_open');
            drop.hide();
          });
          block.on('click', function (ev) {
            block.addClass('my-custom-select_open');
            drop.show();
            searchInput.focus();
            popovers.add(drop.data('parent', block));
            updateScroll();
          });
          searchInput.on('keyup', search);
          let onMenuClickSingle = function (ev) {
            let target = $(ev.target);
            if (target.hasClass('my-custom-select__option') && !target.hasClass('disabled')) {
              change(target);
            }
          };
          let onMenuClickMultiple = function(ev) {
            let target = $(ev.target);
            if (target.hasClass('my-custom-select__option') && !target.hasClass('disabled')) {
              addOption(target);
            }
          };
          menu.on('click', (block.hasClass('my-custom-select_multiple') ? onMenuClickMultiple : onMenuClickSingle));
        });
      }, insertOptions: function (options) {
        $(this).each(function (i, b) {
          let nativeSelect = $(b);
          nativeSelect.data('insertOptions')(options);
        });
      }
    }
  }());
  $.fn.extend({
    jquerySelect: jqueryMultiselect.select,
    insertSelectOptions: jqueryMultiselect.insertOptions
  });
}));
