(function ($) {
  "use strict";

  //Preloader
  Royal_Preloader.config({
    mode: 'progress',
    background: '#ffffff',
    showProgress: true,
    showPercentage: false
  });

  /* Scroll Animation */
  window.scrollReveal = new scrollReveal();

  //Parallax & fade on scroll
  function scrollBanner() {
    $(document).on('scroll', function () {
      const scrollPos = $(this).scrollTop();
      $('.parallax-fade-top').css({
        'top': (scrollPos / 2) + 'px',
        'opacity': 1 - (scrollPos / 850)
      });
    });
  }

  scrollBanner();


  $(document).ready(function () {
    /* Scroll Too */
    $(".scroll").on('click', function (event) {
      event.preventDefault();

      const full_url = this.href;
      const parts = full_url.split("#");
      const trgt = parts[1];
      const target_offset = $("#" + trgt).offset();
      const target_top = target_offset.top - 64;

      $('html, body').animate({scrollTop: target_top}, 800);
    });


    //Scroll back to top

    const offset = 300;
    const duration = 600;
    jQuery(window).on('scroll', function () {
      if (jQuery(this).scrollTop() > offset) {
        jQuery('.scroll-to-top').fadeIn(duration);
      } else {
        jQuery('.scroll-to-top').fadeOut(duration);
      }
    });

    jQuery('.scroll-to-top').on('click', function (event) {
      event.preventDefault();
      jQuery('html, body').animate({scrollTop: 0}, duration);
      return false;
    });


    /* Hero Carousel */
    const $owlHero = $("#owl-hero-1");
    $owlHero.owlCarousel({
      transitionStyle: "goDown",
      singleItem: true,
      itemsMobile: false,
      pagination: true,
      autoPlay: 6000,
      slideSpeed: 400
    });
    $owlHero.owlCarousel();

    // Custom Navigation Events
    $(".next-hero-1").click(function () {
      $owlHero.trigger('owl.next');
    });
    $(".prev-hero-1").click(function () {
      $owlHero.trigger('owl.prev');
    });

    //Parallax
    $('.parallax').parallax("50%", 0.3);
    $('.parallax-1').parallax("50%", 0.3);

    /* Team Carousel */
    $("#owl-team").owlCarousel({
      items: 3,
      itemsDesktop: [1350, 3],
      itemsDesktopSmall: [1000, 2],
      itemsTablet: [600, 1],
      itemsMobile: false,
      pagination: true,
      autoPlay: 8000,
      slideSpeed: 300
    });

    /* Video */
    $(".container").fitVids();

    $('.vimeo a,.youtube a').on('click', function (e) {
      e.preventDefault();
      const videoLink = $(this).attr('href');
      const PlaceV = $(this).parent();
      if ($(this).parent().hasClass('youtube')) {
        $(this).parent().wrapAll('<div class="video-wrapper">');
        $(PlaceV).html('<iframe frameborder="0" height="333" src="' + videoLink + '?autoplay=1&showinfo=0" title="YouTube video player" width="547"></iframe>');
      } else {
        $(this).parent().wrapAll('<div class="video-wrapper">');
        $(PlaceV).html('<iframe src="' + videoLink + '?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1&amp;color=6dc234" width="500" height="281" frameborder="0"></iframe>');
      }
    });

    /* Portfolio Sorting */
    const container = $('.grid-wraper');

    // function getNumbColumns() {
    //   let winWidth = $(window).width(), columnNumb = 1;
    //   if (winWidth > 1500) {
    //     columnNumb = 4;
    //   } else if (winWidth > 1200) {
    //     columnNumb = 3;
    //   } else if (winWidth > 900) {
    //     columnNumb = 2;
    //   } else if (winWidth > 600) {
    //     columnNumb = 1;
    //   } else if (winWidth > 300) {
    //     columnNumb = 1;
    //   }
    //   return columnNumb;
    // }

    // function setColumnWidth() {
    //   let winWidth = $(window).width(),
    //     columnNumb = getNumbColumns(),
    //     postWidth = Math.floor(winWidth / columnNumb);
    //
    // }

    $('.grid-filter .filter a').click(function () {
      const selector = $(this).attr('data-filter');

      $(this).parent().parent().find('a').removeClass('current');
      $(this).addClass('current');

      container.isotope({
        filter: selector
      });

      setTimeout(function () {
        reArrangeProjects();
      }, 300);
      return false;
    });

    function reArrangeProjects() {
      // setColumnWidth();
      container.isotope('layout');
    }

    container.imagesLoaded(function () {
      // setColumnWidth();
      container.isotope({
        itemSelector: '.grid-box',
        layoutMode: 'masonry',
        resizable: false
      });
    });
    $(window).on('debouncedresize', function () {
      reArrangeProjects();
    });
  });

  /* DebouncedResize Function */
  let $event = $.event, $special, resizeTimeout;

  $special = $event.special.debouncedresize = {
    setup: function () {
      $(this).on('resize', $special.handler);
    },
    teardown: function () {
      $(this).off('resize', $special.handler);
    },
    handler: function (event, execAsap) {
      const context = this,
        args = arguments,
        dispatch = function () {
          event.type = 'debouncedresize';
          $event.dispatch.apply(context, args);
        };
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      execAsap ? dispatch() : resizeTimeout = setTimeout(dispatch, $special.threshold);
    },
    threshold: 150
  };
})(jQuery);
