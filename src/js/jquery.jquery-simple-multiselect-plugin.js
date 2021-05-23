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
    let defaults = {
      /**
       * @param optionsContentLoader: (url) => String[]
       * * @param url: url got from data-getOptions attribute
       */
      optionsContentLoader: undefined,
      dropHeight: 240
    };
    let PopupManager = {
      doc: $(document),
      watch: [],
      clickControl: (ev) => {
        if(PopupManager.watch.some(
          (entity) => !entity.rectsToWatch.some(
            (rect) => rect.ymin<=ev.pageY && ev.pageY<=rect.ymax && rect.xmin<=ev.pageX && ev.pageX<=rect.xmax))) {
          PopupManager.doc.off('click.PopupManager');
          for (let i = 0; i < PopupManager.watch.length; i++) {
            PopupManager.watch[i].callbackHide();
          }
          PopupManager.watch = [];
        }
      }, createPopupInstance: function (callbackShow, callbackHide, rectEntities) {
        let arr = Array.isArray(rectEntities) ? rectEntities : [rectEntities], siblings = [];
        callbackShow();
        for (let i = 0; i < arr.length; i++) {
          let rectangleEntity = arr[i],
              offset = rectangleEntity.offset(),
              width = rectangleEntity.outerWidth(),
              height = rectangleEntity.outerHeight(),
              currentRect = {
                ymin: offset.top,
                ymax: offset.top + height,
                xmin: offset.left,
                xmax: offset.left + width,
              };
          siblings.push(currentRect);
        }
        PopupManager.doc.off('click.PopupManager').on('click.PopupManager', PopupManager.clickControl);
        PopupManager.watch.push({
          rectsToWatch: siblings,
          callbackHide: callbackHide
        });
      }
    };
    return {
      select: function (options) {
        options = $.extend({}, defaults, options || {});
        $(this).each(function (i, b) {
          let nativeSelect = $(b), multiple = nativeSelect.attr('multiple') !== undefined,
              dataGetOptions = nativeSelect.attr('data-getOptions'),
              currentOptionPlaceholder = $('<div class="my-custom-select__container w-100"><span class="my-custom-select__placeholder">' + (nativeSelect.attr('data-placeholder') || 'Select') + '</span></div>'),
              currentOptionPlaceholderText = currentOptionPlaceholder.children(),
              selectDrop = $('<div class="my-custom-select__drop" style="display: none;"><div class="my-custom-select__search-container"><input type="text" class="my-custom-select__search-input"><i class="fa fa-search"></i></div><div class="my-custom-select__scroll"><ul class="my-custom-select__menu list-group"></ul></div></div>'),
              searchInput = selectDrop.find('.my-custom-select__search-input'),
              scrollWrapperBlock = selectDrop.find('.my-custom-select__scroll'),
              renderedOptionsMenuContainer = selectDrop.find('.my-custom-select__menu'),
              nativeOptions = nativeSelect.children('option'),
              badge = $('<span class="my-custom-select__badge"></span>'), btnClose = $('<span class="btn close p-0">&times;</span>');
          nativeSelect.wrap('<div class="my-custom-select' + (multiple ? ' my-custom-select_multiple' : '') + '"></div>')
            .css('display', 'none');
          let block = nativeSelect.parent();
          selectDrop.hide();
          nativeSelect.before(currentOptionPlaceholder).after(selectDrop);
          let change = function(option) {
            currentOptionPlaceholderText.text(option.text());
            nativeOptions.removeAttr('selected');
            nativeOptions.prop('selected', false);
            let nativeOption = nativeOptions.filter('[value="' + option.attr('data-value') + '"]');
            nativeOption.attr('selected', '');
            nativeOption.prop('selected', true);
            hideSelectDrop();
            renderOptionsFromNative(nativeOptions);
          };
          let addOption = function(option) {
            let b = badge.clone(), cl = btnClose.clone(), nativeOption = nativeOptions.filter('[value="' + option.attr('data-value') + '"]');
            nativeOption.prop('selected', true);
            nativeOption.attr('selected', '');
            b.text(option.text());
            b.on('click', ev => ev.stopPropagation()).append(cl);
            cl.on('click', (ev) => {ev.stopPropagation(); removeOption(b, nativeOption)});
            option.hide();
            currentOptionPlaceholder.append(b);
            updatePlaceholder();
          };
          let removeOption = function(badge, nativeOption) {
            nativeOption.prop('selected', false);
            nativeOption.removeAttr('selected');
            badge.remove();
            updatePlaceholder();
            search();
          };
          let updateScroll = function() {
            if (renderedOptionsMenuContainer.outerHeight > (nativeSelect.attr('data-dropHeight') || options.dropHeight)) {
              scrollWrapperBlock.css('overflow-y', 'scroll');
            } else {
              scrollWrapperBlock.css('overflow-y', 'auto');
            }
          };
          let updatePlaceholder = function() {
            if (currentOptionPlaceholder.has('.my-custom-select__badge').length === 0) {
              currentOptionPlaceholderText.show();
            } else {
              currentOptionPlaceholderText.hide();
            }
          }
          let renderOptionsFromNative = function(filteredNativeOptions) {
            let listToShow = '';
            filteredNativeOptions.each(function(i, o) {
              let nativeOption = $(o), optionRender = '<li class="list-group-item list-group-item-action my-custom-select__option" data-value="' + nativeOption.attr('value') + '">' + nativeOption.text() + '</li>';
              if (!nativeOption.attr('selected')) {
                listToShow = listToShow += optionRender;
              }
            });
            if (listToShow.length === 0) {
              listToShow = '<li class="list-group-item list-group-item-action my-custom-select__option disabled" data-value="Nothing to show">Nothing to show</li>';
            }
            renderedOptionsMenuContainer.empty().append(listToShow);
            updateScroll();
          };
          let search = function () {
            let searchValue = searchInput.val(), filteredOptions = nativeOptions.filter(function (i, op) {
                  return new RegExp(searchValue + '.*', 'gi').test(op.innerHTML);});
            renderOptionsFromNative(filteredOptions);
          };
          let hideSelectDrop = function () {
            block.removeClass('my-custom-select_open');
            selectDrop.hide();
          };
          let showSelectDrop = function () {
            block.addClass('my-custom-select_open');
            selectDrop.show();
            searchInput.focus();
            updateScroll();
          };
          currentOptionPlaceholder.on('click', (ev) => {
            PopupManager.createPopupInstance(showSelectDrop, hideSelectDrop, [block, selectDrop]);
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
          renderedOptionsMenuContainer.on('click', (block.hasClass('my-custom-select_multiple') ? onMenuClickMultiple : onMenuClickSingle));
          nativeSelect.data('insertOptions', function (opts, append=false) {
            let optionsToInsert = '';
            for (let opt of opts) {
              optionsToInsert += '<option value="' + opt + '">' + opt + '</option>';
            }
            nativeSelect[append ? 'append' : 'html'](optionsToInsert);
            nativeOptions = nativeSelect.children('option');
            renderOptionsFromNative(nativeOptions);
          });
          if (options.optionsContentLoader) {
            nativeSelect.data('insertOptions')(options.optionsContentLoader(dataGetOptions));
          }
        });
      }, insertOptions: function (optionsArray, append=false) {
        $(this).each(function (i, b) {
          let nativeSelect = $(b);
          nativeSelect.data('insertOptions')(optionsArray, append);
        });
      }
    }
  }());
  $.fn.extend({
    jquerySelect: jqueryMultiselect.select,
    insertSelectOptions: jqueryMultiselect.insertOptions
  });
}));
