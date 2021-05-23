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
  let strippedSlider = (function () {
    let defaults = {};
    return {
      init: function (options) {
        options = $.extend({}, defaults, options || {});
        $(this).each(function (i, b) {
          let rootElem = $(b), isDouble = (rootElem.attr('data-double') === 'true'), dataLabel = rootElem.attr('data-label'),
              hasTooltip = rootElem.attr('data-tooltip') === 'true', isVertical = rootElem.attr('data-orientation') === 'vertical',
              min = parseInt(rootElem.attr('min')) || 0, max = parseInt(rootElem.attr('max')) || 100, step = parseInt(rootElem.attr('step')) || 1, doc = $(document),
              dataPrefix = rootElem.attr('data-prefix') || '', dataPostfix = rootElem.attr('data-postfix') || '';
          let inputLeft = $(rootElem.attr('data-leftInputNode')), inputRight = isDouble ? $(rootElem.attr('data-rightInputNode')) : $([]);
          inputLeft.addClass('stripped-slider__input-left').add(
            isDouble ? inputRight.addClass('stripped-slider__input-right') : $([]))
            .wrapAll('<div class="stripped-slider__head"></div>');
          let sliderHead = inputLeft.parent();
          if(isDouble) { // modern problems require modern solutions
            let lv = inputLeft.attr('value') || min, rv = inputRight.attr('value') || max;
            inputLeft.attr('value', rv);
            inputRight.attr('value', lv);
            let c = $('<div></div>');
            c.insertAfter(inputLeft);
            inputLeft.insertAfter(inputRight);
            inputRight.insertAfter(c);
            c.remove();
          }
          sliderHead.children().wrapAll('<div class="d-flex flex-wrap"></div>');
          if (dataLabel !== undefined && isDouble) {
            inputRight.after('<span class="stripped-slider__defis">-</span>');
          }
          sliderHead.prepend('<label for="' + rootElem.attr('data-leftInputNode') + '" class="stripped-slider__label'
            + (dataLabel === undefined ? ' sr-only' : '') + '">' + (dataLabel || 'Slider bar') + '</label>');
          sliderHead.wrap('<div class="stripped-slider' + (isDouble ? ' stripped-slider_double' : '')
            + ' stripped-slider_' + (rootElem.attr('data-skin') || 'purple')
            + (dataLabel ? ' stripped-slider_labelled' : '') + (hasTooltip ? ' stripped-slider_tooltip' : '')
            + ' stripped-slider_' + (isVertical ? 'vertical' : 'horizontal') + '">');
          let block = sliderHead.parent();
          block.append('<div class="stripped-slider__container"><div class="stripped-slider__background"></div><div class="stripped-slider__progress" role="progressbar" style="' + (isVertical ? 'height' : 'width') + ': 0" aria-valuenow="' + min + '" aria-valuemin="' + min + '" aria-valuemax="' + max + '"></div><div class="stripped-slider__slide-area"><i class="stripped-slider__fa-handle"><span class="stripped-slider__tooltip"></span></i>' + (isDouble ? '<i class="stripped-slider__fa-handle-right"><span class="stripped-slider__tooltip"></span></i>' : '') + '</div></div>');
          let container = block.find('.stripped-slider__container'), background = block.find('.stripped-slider__background'),
              tooltipLeft = block.find('.stripped-slider__fa-handle .stripped-slider__tooltip'),
              tooltipRight = block.find('.stripped-slider__fa-handle-right .stripped-slider__tooltip'),
              handleLeft = block.find('.stripped-slider__fa-handle, .stripped-slider__handle'),
              handleRight = block.find('.stripped-slider__fa-handle-right, .stripped-slider__handle-right'),
              progress = block.find('.stripped-slider__progress'), scrollArea = block.find('.stripped-slider__slide-area'),
              scrollAreaWidth = scrollArea.innerWidth(),
              scrollAreaHeight = scrollArea.innerHeight(),
              currentXLeft = 0, currentXRight = 0,
              valueLeftPx, valueLeftRelative, valueLeft,
              valueRightPx, valueRightRelative, valueRight,
              lockDelay = 50, lock = false;
          let updatePositionL = function() {
            scrollAreaWidth = scrollArea.innerWidth();
            scrollAreaHeight = scrollArea.innerHeight();
            let scrollAreaLength = isVertical ? scrollAreaHeight : scrollAreaWidth;
            if (currentXLeft < currentXRight) {
              currentXRight = currentXLeft;
              updatePositionR();
            }
            valueLeftPx = currentXLeft < 0 ? 0 : (currentXLeft > scrollAreaLength ? scrollAreaLength : (currentXLeft < valueRightPx ? valueRightPx : currentXLeft));
            let stepRel = step / (max - min) * scrollAreaLength;
            valueLeftPx = Math.round(valueLeftPx / stepRel) * stepRel;
            valueLeftRelative = valueLeftPx / scrollAreaLength;
            valueLeft = Math.round(((max - min) * valueLeftRelative) / step) * step + min;
            handleLeft.css(isVertical ? 'bottom' : 'left', valueLeftPx + 'px');
            progress.css(isVertical ? 'height' : 'width', isDouble ? valueLeftPx - valueRightPx : valueLeftPx + 'px');
            inputLeft.val(dataPrefix + valueLeft + dataPostfix);
            tooltipLeft.text(valueLeft);
          };
          let updatePositionR = function() {
            scrollAreaWidth = scrollArea.innerWidth();
            scrollAreaHeight = scrollArea.innerHeight();
            let scrollAreaLength = isVertical ? scrollAreaHeight : scrollAreaWidth;
            if (currentXRight > currentXLeft) {
              currentXLeft = currentXRight;
              updatePositionL();
            }
            valueRightPx = currentXRight < 0 ? 0 : (currentXRight > scrollAreaLength ? scrollAreaLength : (currentXRight > valueLeftPx ? valueLeftPx : currentXRight));
            let stepRel = step / (max - min) * scrollAreaLength;
            valueRightPx = Math.round(valueRightPx / stepRel) * stepRel;
            valueRightRelative = valueRightPx / scrollAreaLength;
            valueRight = Math.round(((max - min) * valueRightRelative) / step) * step + min;
            handleRight.css(isVertical ? 'bottom' : 'left', valueRightPx + 'px');
            progress.css(isVertical ? 'bottom' : 'left', valueRightPx + 'px')
              .css(isVertical ? 'height' : 'width', (valueLeftPx - valueRightPx) + 'px');
            inputRight.val(dataPrefix + valueRight + dataPostfix);
            tooltipRight.text(valueRight);
          };
          let mouseMoveL = function(ev) {
            currentXLeft = isVertical ? -(ev.pageY - scrollArea.offset().top - scrollArea.innerHeight()) : ev.pageX - scrollArea.offset().left;
            if (!lock) {
              lock = true;
              setTimeout(()=>{lock=false;}, lockDelay);
              updatePositionL();
            }
          };
          let mouseMoveR = function(ev) {
            currentXRight = isVertical ? -(ev.pageY - scrollArea.offset().top - scrollArea.innerHeight()) : ev.pageX - scrollArea.offset().left;
            if (!lock) {
              lock = true;
              setTimeout(()=>{lock=false;}, lockDelay);
              updatePositionR();
            }
          };
          handleLeft.on('mousedown', function (ev) {
            ev.stopPropagation();
            handleRight.css('z-index', 1);
            handleLeft.css('z-index', 2);
            doc.on('mousemove.strippedSlider', mouseMoveL);});
          if (isDouble) {
          handleRight.on('mousedown', function (ev) {
            ev.stopPropagation();
            handleRight.css('z-index', 2);
            handleLeft.css('z-index', 1);
            doc.on('mousemove.strippedSlider', mouseMoveR);});}
          doc.on('mouseup', function (ev) {doc.off('mousemove.strippedSlider');});
          container.on('click', function (ev) {
            let i = isVertical ? -(ev.pageY - scrollArea.offset().top - scrollArea.innerHeight()) : ev.pageX - scrollArea.offset().left;
            if (isDouble) {
              if (Math.abs(currentXLeft - i) < Math.abs(currentXRight - i)) {
                currentXLeft = i;
                updatePositionL();
              } else {
                currentXRight = i;
                updatePositionR();
              }
            } else {
              currentXLeft = i;
              updatePositionL();
            }
          });
          let f1 = function (ev) {
            let val = /\d+/.exec(inputLeft.val());
            val = val == null ? 0 : parseInt(val[0]);
            currentXLeft = (val - min) / (max - min) * (isVertical ? scrollAreaHeight : scrollAreaWidth);
            updatePositionL();
          };
          inputLeft.on('blur', f1);
          let f2 = function (ev) {
            let val = /\d+/.exec(inputRight.val());
            val = val == null ? 0 : parseInt(val[0]);
            currentXRight = (val - min) / (max - min) * (isVertical ? scrollAreaHeight : scrollAreaWidth);
            updatePositionR();
          };
          inputRight.on('blur', f2);
          f1();
          f2();
          updatePositionL();
          if (isDouble) {updatePositionR();}
          container.on('update', updatePositionL);
          if (isDouble) {container.on('update', updatePositionR);}
        });
      },
    }
  }());
    $.fn.extend({
        strippedSlider: strippedSlider.init,
    });
}));
