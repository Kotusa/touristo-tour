let catalogSwiper;

mobile();
search();
extended();
calendar();
rangeSlider();
dropdown();
amountCounter();
filter();
catalogSlider();
specialSlider();
testimonialsSlider();
tabs();
price();
accordion();
switchImage();
reviewPopup();

function mobile() {
  $('[rel="js-mobile-toggle"]').on('click', function () {
    $(this).toggleClass('active');
    $('[rel="js-mobile-menu"]').toggleClass('active');
    $('body').toggleClass('locked');
  });
}
function search() {
  let searchBlock = $('[rel="js-search"]');
  let searchInput = searchBlock.find('[rel="js-search-input"]');
  let tagsContainer = searchBlock.find('[rel="js-search-tags"]');
  let searchResult = searchBlock.find('[rel="js-search-result"]');
  let selectedTags = [];
  let resultArray = [];

  function createTag(content, id) {
    return `
        <li class="b-tags__tag b-tag">
        <p class="b-tag__content">${content}</p>
        <span class="b-tag__cancel" rel="js-tag-cancel" data-id=${id}>&times;
        </span></li>
        `;
  }

  function renderTags() {
    tagsContainer.empty();
    selectedTags
      .slice()
      .reverse()
      .forEach(function (tag) {
        tagsContainer.prepend(createTag(tag.content, tag.id));
      });
  }

  function watchInput() {
    searchInput.on('keydown', function (event) {
      let key = window.event ? event.keyCode : event.which;
      if (key == '13' || key == '9') {
        event.preventDefault();
        if ($(this).val() !== '' && /\S/.test($(this).val())) {
          if (tagsContainer.children().length < 6) {
            $(event.target)
              .val()
              .trim()
              .split(',')
              .forEach(function (tag) {
                tag = tag
                  .toLowerCase()
                  .replace(
                    /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
                    function (letter) {
                      return letter.toUpperCase();
                    }
                  );
                if (!checkAvailability(selectedTags, tag)) {
                  selectedTags.push({ content: tag, id: randomID() });
                  renderTags();
                  deleteTag();
                  watchTagsChildren();
                  searchResult.removeHighlight();
                  searchInput.val('');
                }
              });
          }
        }
      }
    });

    searchInput.on('input', function (event) {
      if (resultArray.length !== 0) {
        searchResult.show();
      }
      if (!$(this).val()) {
        searchResult.hide();
      }
      let searchTerm = $(this).val();
      $('[rel="js-result-list"]').removeHighlight();

      if (searchTerm) {
        $('[rel="js-result-list"]').highlight(searchTerm);
      }
    });

    searchInput.on('keyup', function () {
      let filter = $(this).val();
      $('.b-search__result .b-result__item').each(function () {
        if ($(this).text().search(new RegExp(filter, 'i')) < 0) {
          $(this).hide();
          $(this).addClass('hidden');
          let value = $(this).data('name');
          resultArray = resultArray.filter(function (item) {
            return item !== value;
          });
          checkItemsExist();
        } else {
          if (!$(this).hasClass('selected')) {
            $(this).show();
            $(this).removeClass('hidden');
            resultArray.push($(this).data('name'));
            resultArray = resultArray.filter(uniqueVal);
            checkItemsExist();
          }
        }
      });
      if (resultArray.length !== 0 && filter) {
        searchResult.slideDown();
      }
    });

    $(document).on('click', function (event) {
      var el = searchBlock;
      if ($(event.target).closest(el).length) return;
      searchResult.hide();
    });
  }

  function checkItemsExist() {
    let resultList = $('[rel="js-result-list"]');
    resultList.each(function () {
      let wrapChildren = $(this).find('[rel="js-result-item"]');
      if (!wrapChildren.not('.hidden').length) {
        wrapChildren.parent().parent().fadeOut();
      } else {
        wrapChildren.parent().parent().fadeIn();
      }
    });
    if (resultArray.length == 0) {
      searchResult.hide();
    }

    if (selectedTags.length > 0) {
      isSelectedTag();
    }
  }

  function isSelectedTag() {
    selectedTags.forEach(function (item) {
      $('[rel="js-result-item"]').each(function () {
        let content = $(this).html();
        if (item.content == content) {
          $(this).addClass('selected');
          $(this).hide();
        }
      });
    });
  }

  function resultEvent() {
    $('[rel="js-result-item"]').on('click', function () {
      if (tagsContainer.children().length < 5) {
        selectedTags.push({ content: $(this).data('name'), id: randomID() });
        renderTags();
        deleteTag();
        watchTagsChildren();
        searchInput.val('');
        searchResult.removeHighlight();
        $(this).hide();
        $(this).addClass('hidden selected');
      }
    });
  }

  function deleteTag() {
    let tagAction = $('[rel="js-tag-cancel"]');
    tagAction.on('click', function () {
      $(this)
        .parent()
        .fadeOut(200, function () {
          $(this).remove();
        });
      let tagID = $(this).data('id');
      selectedTags = selectedTags.filter(function (tag) {
        return tag.id !== tagID;
      });
      setTimeout(function () {
        watchTagsChildren();
      }, 300);
      $(`[data-name="${$(this).siblings('p').html()}"]`)
        .fadeIn()
        .removeClass('selected');
    });
  }

  function watchTagsChildren() {
    if (tagsContainer.children().length > 0) {
      searchInput.addClass('placeholder');
    } else {
      searchInput.removeClass('placeholder');
      searchResult.hide();
    }
    if (tagsContainer.children().length == 5) {
      searchInput.prop('disabled', true);
    } else {
      searchInput.prop('disabled', false);
    }
  }

  function randomID() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  function uniqueVal(value, index, self) {
    return self.indexOf(value) === index;
  }

  function checkAvailability(arr, val) {
    return arr.some(function (arrVal) {
      return val === arrVal.content;
    });
  }

  resultEvent();
  watchInput();
}
function rangeSlider() {
  let slider = document.querySelector('[rel="js-range-slider"]');

  noUiSlider.create(slider, {
    start: 2,
    connect: [true, false],
    step: 1,
    tooltips: true,
    orientation: 'horizontal',
    range: {
      min: [2],
      max: [120],
    },
    format: {
      decimals: 0,
      from: Number,
      to: function (value) {
        return parseInt(value) + ' дн.';
      },
    },
  });
}
function calendar() {
  moment.locale('ru');
  let calendarContent = $('[rel="js-calendar"]');
  let start = moment().subtract(29, 'days');
  let end = moment();
  calendarContent.daterangepicker(
    {
      startDate: start,
      endDate: end,
      opens: 'right',
      buttonClasses: 'b-calendar__button b-button',
      locale: {
        format: 'DD MMMM',
        separator: ' - ',
        applyLabel: 'Применить',
        cancelLabel: 'Отменить',
        fromLabel: 'От',
        toLabel: 'До',
        customRangeLabel: 'Custom',
        daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: [
          'Январь',
          'Февраль',
          'Март',
          'Апрель',
          'Май',
          'Июнь',
          'Июль',
          'Август',
          'Сентябрь',
          'Октябрь',
          'Ноябрь',
          'Декабрь',
        ],
        firstDay: 1,
      },
    },
    callback
  );

  calendarContent.on('show.daterangepicker', function () {
    calendarContent.addClass('active');
    isShown = true;
  });
  calendarContent.on('hide.daterangepicker', function () {
    calendarContent.removeClass('active');
    isShown = false;
  });

  function callback(start, end) {
    calendarContent
      .find('[rel="js-calendar-content"]')
      .html(start.format('DD MMMM') + ' - ' + end.format('DD MMMM'));
  }
  callback(start, end);
}
function extended() {
  let title = $('[rel="js-extended-title"]');
  let content = $('[rel="js-extended"]');
  title.on('click', function () {
    $(this, content).toggleClass('hidden');
    if (title.hasClass('hidden')) {
      content.slideUp();
      title.text(title.data('hidden'));
    } else {
      content.slideDown();
      title.text(title.data('shown'));
    }
  });
}
function dropdown() {
  let dropdown = $('[rel="js-dropdown"]');
  dropdown.each(function () {
    let dropdownCaption = $(this).find('[rel="js-dropdown-caption"]');
    let dropdownContent = $(this).find('[rel="js-dropdown-content"]');
    let dropdownArrow = $(this).find('.b-dropdown__icon--arrow');

    dropdownCaption.on('click', function () {
      dropdownContent.toggle();
      dropdown.toggleClass('active');
      dropdownArrow.toggleClass('active');
    });

    $(document).on('click', function (event) {
      if (!$(event.target).closest(dropdown).length) {
        dropdownContent.hide();
        dropdown.removeClass('active');
        dropdownArrow.removeClass('active');
      }
    });
  });
}
function amountCounter() {
  let plusButton = $('[rel="js-plus-button"]');
  let minusButton = $('[rel="js-minus-button"]');

  plusButton.on('click', function () {
    $(this)
      .parent()
      .prev()
      .val(+$(this).parent().prev().val() + 1);
  });
  minusButton.on('click', function () {
    if ($(this).parent().prev().val() > 0) {
      $(this)
        .parent()
        .prev()
        .val(+$(this).parent().prev().val() - 1);
    }
  });
}
function filter() {
  let defaultCategory = $('[rel="js-filter-tag"].active').data(
    'category-target'
  );

  function handleTagClick() {
    let tags = $('[rel="js-filter-tag"]');
    tags.each(function () {
      $(this).on('click', function () {
        tags.removeClass('active');
        $(this).addClass('active');

        getCategory($(this));
        catalogSwiper.update();
      });
    });
  }

  function getCategory(element) {
    let selectedCategory = element.data('category-target');
    filterElements(selectedCategory);
  }

  function filterElements(category = defaultCategory) {
    $('[data-category]').parent().hide();
    if (category == 'all') {
      $('[data-category]').addClass('visible');
      $('[data-category]').parent().show();
    } else {
      let cards = $('[data-category]');
      cards.each(function () {
        let card = $(this);
        let categoriesArray = $(this).data('category').split(',');
        categoriesArray.map(function (item) {
          if (item == category) {
            card.addClass('visible');
            if (card.hasClass('visible')) {
              card.parent().show();
            }
          }
        });
      });
    }
  }

  handleTagClick();
  filterElements();
}
function catalogSlider() {
  let breakpoint = window.matchMedia('(min-width: 989.9px)');
  let breakpointChecker = function () {
    if (breakpoint.matches === true) {
      if (catalogSwiper !== undefined) catalogSwiper.destroy(true, true);
      return;
    } else if (breakpoint.matches === false) {
      return enableSwiper();
    }
  };

  let enableSwiper = function () {
    catalogSwiper = new Swiper('[rel="js-catalog-slider"]', {
      slidesPerView: 1.2,
      spaceBetween: 15,
      slidesOffsetBefore: 20,
      slidesOffsetAfter: 20,
      breakpoints: {
        400: {
          slidesPerView: 1.5,
        },
        460: {
          slidesPerView: 1.6,
        },
        520: {
          slidesPerView: 1.8,
        },
        600: {
          slidesPerView: 2,
        },
        650: {
          slidesPerView: 2.2,
        },
        690: {
          slidesPerView: 2.4,
        },
        767: {
          slidesPerView: 2.8,
        },
        890: {
          slidesPerView: 3.1,
        },
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
    });
  };
  breakpointChecker();
}
function tabs() {
  let button = $('[rel="js-tabs-title"]');
  let content = $('[rel="js-tabs"]');

  button.on('click', function () {
    button.removeClass('active');
    content.removeClass('active');
    $(`[data-name=${$(this).data('name')}]`).addClass('active');
  });
}
function specialSlider() {
  let breakpoint = window.matchMedia('(min-width: 767.9px)');
  let mySwiper;
  let breakpointChecker = function () {
    if (breakpoint.matches === true) {
      if (mySwiper !== undefined) mySwiper.destroy(true, true);
      return;
    } else if (breakpoint.matches === false) {
      return enableSwiper();
    }
  };
  let enableSwiper = function () {
    mySwiper = new Swiper('[rel="js-special-slider"]', {
      slidesPerView: 1.2,
      spaceBetween: 15,
      slidesOffsetBefore: 20,
      slidesOffsetAfter: 20,
      breakpoints: {
        400: {
          slidesPerView: 1.5,
        },
        460: {
          slidesPerView: 1.6,
        },
        520: {
          slidesPerView: 1.8,
        },
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
    });
  };
  breakpointChecker();
}
function testimonialsSlider() {
  mySwiper = new Swiper('[rel="js-testimonials-slider"]', {
    slidesPerView: 1,
    spaceBetween: 15,
    breakpoints: {
      500: {
        slidesPerView: 1.5,
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
      },
      680: {
        slidesPerView: 2,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      },
      990: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}
function price() {
  function normalPrice(str) {
    return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  }
  let price = $('[rel="js-price"]');
  let priceEq = $('[rel="js-price-eq"]');
  price.each(function (index, element) {
    $(this).html(normalPrice($(this).html()));
  });
  priceEq.each(function (index, element) {
    $(this).html(normalPrice($(this).html()));
  });
}
function accordion() {
  let accordion = $('[rel="js-accordion-toggle"]');
  function accordionToggle() {
    accordion.on('click', function () {
      $(this).toggleClass('active');

      if ($(this).hasClass('active')) {
        $(this).next().slideDown();
      } else {
        $(this).next().slideUp();
      }
    });
  }

  function mobileAccordionToggle() {
    $('[rel="js-accordion-toggle"]').next().slideUp();
    accordionToggle();
  }
  if ($(window).innerWidth() < 576) {
    mobileAccordionToggle();
  }
}
function switchImage() {
  let cards = $('[rel="js-card"]');
  cards.each(function () {
    let currentProduct = $(this);
    let switchItems = $(this).find($('[rel="js-switch-preview"]').children());
    let switchPagination = $(this).find($('[rel="js-switch-pagination"]'));
    if (switchItems.length > 1) {
      switchItems.each(function (index) {
        $(this).attr('data-index', index);
        let paginationBullet = `<li class="b-pagination__item ${
          index == 0 ? 'active' : ''
        }" data-index="${index}"></li>`;
        switchPagination.append(paginationBullet);

        $(this).on('mouseenter', function (e) {
          let current = $(e.target);
          let paginationBlock = currentProduct.find('.b-pagination__item');

          paginationBlock.each(function () {
            $(this).removeClass('active');
          });
          currentProduct
            .find(`.b-pagination__item[data-index="${current.data('index')}"]`)
            .addClass('active');
        });

        $(this).on('mouseout', function () {
          currentProduct.find('.b-pagination__item').each(function () {
            $(this).removeClass('active');
            currentProduct
              .find('.b-pagination__item[data-index="0"]')
              .addClass('active');
          });
        });
      });
    }
  });
}
function reviewPopup() {
  $.fancybox.defaults.hideScrollbar = false;
  $('.b-review__content-toggle').fancybox({
    closeExisting: false,
    loop: false,
  });
  $('.b-review__content-toggle').on('click', function () {
    let reviewTitle = $(this)
      .closest('.b-review')
      .find('.b-review__title')
      .text();
    let reviewText = $(this)
      .closest('.b-review')
      .find('.b-review__text')
      .text();
    $('#review-popup').find('.b-review__title').text(reviewTitle);
    $('#review-popup').find('.b-review__text').text(reviewText);
  });

  $('.b-review__content').each(function () {
    let reviewHeight = $(this).outerHeight();
    let lineHeightReview;
    if ($(window).width() > 767) {
      lineHeightReview = 27;
    } else {
      lineHeightReview = 20.7;
    }
    let amountLines = Math.round(reviewHeight / lineHeightReview);
    if (amountLines > 9) {
      $(this).addClass('overflow');
      $(this).find('.b-review__text').css({ '-webkit-box-orient': 'vertical' });
      $(this).siblings('.b-review__content-toggle').show();
    }
  });
}
