
$(function () {
    const $win = $(window);
    const $body = $("html, body");
    const $fader = $('<div class="fader"></div>').hide();
    const $mainHeader = $("header.header");
    const fixedHeight = 116;
    const mobSizeContent = 640;
    const mobSizeAside = 768;

    $fader.appendTo("body > div.wrapper");

    // fixed header
    document.addEventListener(
        "scroll",
        function (event) {
            const scrolled = $body.scrollTop() > fixedHeight;
            if (scrolled && !$mainHeader.hasClass("fixed")) {
                $mainHeader.addClass("fixed");
            } else if (!scrolled && $mainHeader.hasClass("fixed")) {
                $mainHeader.removeClass("fixed");
            }
        },
        true /*Capture event*/
    );

    // navigation
    const durShow = 300;
    const durHide = 300;
    $("nav.nav li > div.drop").each(function () {
        const $drop = $(this).hide();
        $(this)
            .parent()
            .on("mouseenter", function (e) {
                $fader.fadeIn(durShow);
                $drop.stop().slideDown(durShow);
            })
            .on("mouseleave", function () {
                $fader.fadeOut(durHide);
                $drop.stop().slideUp(durHide);
            })
            .on("click", function (e) {
                e.preventDefault();
            });
    });

    // promo gallery
    $(".slick-scroll-3").each(function () {
        $(".slide-holder", this).slick({
            infinite: true,
            dots: false,
            prevArrow: $("a.prev", this),
            nextArrow: $("a.next", this),
            slidesToShow: 3,
            slidesToScroll: 3,
            responsive: [
                {
                    breakpoint: mobSizeContent,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        });
    });
    $("section.section-history").each(function () {
        $(".slide-holder", this).slick({
            infinite: true,
            dots: false,
            prevArrow: $("a.prev", this),
            nextArrow: $("a.next", this),
            slidesToShow: 2,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: mobSizeContent,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        adaptiveHeight: true,
                    },
                },
            ],
        });
    });

    initSlide({
        $holder: $(".slick-scroll-1"),
        slickClass: ".gallery",
        navClass: ".bullet",
        slideClass: "div.gallery-image",
        nextClass: "a.next",
        prevClass: "a.prev",
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
    });

    initSlide({
        $holder: $(".section-reviews"),
        slickClass: "div.reviews-content",
        navClass: ".bullet",
        slideClass: "div.slide",
        nextClass: "a.next",
        prevClass: "a.prev",
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
    });

    initSlide({
        $holder: $(".plus-holder"),
        slickClass: "div.plus-holder-slide",
        navClass: ".bullet",
        slideClass: "div.plus-slide",
        counterClass: "div.counter-box",
        nextClass: "a.next",
        prevClass: "a.prev",
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
    });

    function initSlide(opt) {
        opt.$holder.each(function () {
            const $nav = $(opt.navClass, this);
            const $counter = $(opt.counterClass, this);
            const $slick = $(opt.slickClass, this);
            const $slides = $slick.find(opt.slideClass);
            const bullets = function (index) {
                return `<span class="${index || "active"}"><a href="#" data-index="${index}"></a></span>`;
            };
            const counterHtml = function (index) {
                return `<span>${index + 1}</span><span>/</span><span>${$slides.length}</span>`;
            };
            $slick
                .slick({
                    infinite: true,
                    dots: false,
                    fade: opt.fade,
                    prevArrow: $(opt.prevClass, this),
                    nextArrow: $(opt.nextClass, this),
                    slidesToShow: opt.slidesToShow,
                    slidesToScroll: opt.slidesToScroll,
                })
                .on("afterChange", function (e, slick, index) {
                    $counter.html(counterHtml(index));
                    $nav.find("a").parent().removeClass("active");
                    $nav.find("a").eq(index).parent().addClass("active");
                });

            $nav.append($slides.map(bullets).get());
            $nav.on("click", "a", function (e) {
                e.preventDefault();
                $slick.slick("slickGoTo", $(this).data("index"));
            });
            $counter.html(counterHtml(0));
        });
    }

    // lightbox (image popup)
    if ($.magnificPopup) {
        $("a.zoom").magnificPopup({
            type: "image",
            mainClass: "mfp-with-zoom",
            zoom: {
                enabled: true,
                opener: function (openerElement) {
                    return openerElement;
                },
            },
        });

        $(".popup-btn").magnificPopup({
            type: "inline",
            preloader: false,
            mainClass: "mfp-with-zoom",
            modal: true,
        });
        $(document).on("click", "a.close", function (e) {
            e.preventDefault();
            $.magnificPopup.close();
        });
    }

    if ($().stickyScrollBlock) {
        let $navSide = $("#side-nav").stickyScrollBlock({
            container: "#aside",
            extraTop: 140,
        });
        $("#akcia").stickyScrollBlock({
            container: "#stick-wrapper",
            extraTop: 100,
            setBoxHeight: false,
        });
        
        $win.on("size:d", function (e) {
            $navSide = $("#side-nav").stickyScrollBlock({
                container: "#aside",
                extraTop: 140,
            });
        });
        $win.on("size:m", function (e) {
            if ($navSide.data("StickyScrollBlock")) {
                $navSide.data("StickyScrollBlock").destroy();
            }
        });
    }

    var $stickWrapper = $('#stick-wrapper');
    var $aOpener = $('div.aside-menu-opener');
    $aOpener.click(function(){
        if (!$(this).hasClass('menu-open')) {
            $win.scrollTop($stickWrapper.offset().top - 100);
        }
        $(this).toggleClass('menu-open');
    });

    var scrollVal = 0;
    var initialMenuPos;
    var $headerBt = $('header .header-bottom');
    var hh = $headerBt.outerHeight();
    var abs = false;
    var getMenu = function(){
        if (!initialMenuPos) {
         initialMenuPos = $aOpener.offset().top;
        }
        var cur = $win.scrollTop();
        var dif = scrollVal - cur;
        scrollVal = cur;

        var posDiff = cur - initialMenuPos + hh - 34;
        if (dif >= 1 && cur > initialMenuPos && window.innerWidth <= mobSizeContent) {
            $aOpener.css({
                // transition: "transform 0.3s ease",
                // "-webkit-transition": "transform 0.3s ease",
                position: 'fixed',
                top: hh - 34,
                left: 15
                // transform: "translateY(" + posDiff + "px)",
                // "-webkit-transform": "translateY(" + posDiff + "px)",
            });
            abs = false;
        } else if (dif < 0 && !abs) {
            $aOpener.css({
                position: 'absolute',
                top: posDiff,
                left: 0
            });
            abs = true;
        } else if (cur + hh - 34 <= initialMenuPos) {
            $aOpener.css({
                // transition: "none",
                // "-webkit-transition": "none",
                position: 'absolute',
                top: 0,
                left: 0,
                transform: "none",
                "-webkit-transform": "none",
            });
            abs = true
        }
    }
    $win.on('scroll', function() {
        getMenu()
    }).on("resize", function(){
        $aOpener.css({
            transition: "none",
            "-webkit-transition": "none",
            transform: "none",
            "-webkit-transform": "none",
        });
        initialMenuPos = 0;
    });


    if (typeof SmoothScroll !== "undefined" && $("#side-nav").length) {
        new SmoothScroll({
            extraOffset: 93,
            anchorLinks: "#side-nav a",
            activeClasses: "active",
            wheelBehavior: "ignore",
            animDuration: 800,
        });
    }

    // heights
    $("div.contest-content").each(function () {
        let max = 0;
        $("div.contest div.text", this)
            .each(function () {
                const h = $(this).height();
                max = max < h ? h : max;
            })
            .height(max);
    });

    // masonry
    if ($().masonry) {
        $("div.paintings").masonry({
            // options
            itemSelector: ".item",
            gutter: 30,
            columnWidth: ".item",
        });
    }

    // click
    const dropClass = "drop-open";
    const $header = $("body");
    const $mainDrop = $("div.menu-opener-content").hide();
    $("button.menu-opener").on("click", function () {
        if ($header.hasClass(dropClass)) {
            $fader.fadeOut(durHide);
            $mainDrop.fadeOut(durHide);
        } else {
            $fader.fadeIn(durShow);
            $mainDrop.fadeIn(durShow);
        }
        $header.toggleClass(dropClass);
    });
    $("nav.menu a").on("click", function () {
        $header.removeClass(dropClass);
        $mainDrop.fadeOut(durHide);
    });

    // left menu
    const menuBtn = document.querySelector(".menu-btn");
    if (menuBtn) {
        const subMenuBtn = document.querySelector(".sub-menu-btn");
        const aside = document.querySelector(".aside");
        menuBtn.addEventListener("click", function () {
            aside.classList.toggle("aside-open");
            menuBtn.classList.toggle("close");
        });
        subMenuBtn.addEventListener("click", function () {
            aside.classList.toggle("sub-menu-open");
            removeSubmenu();
        });

        function removeSubmenu() {
            let subMenu = aside.querySelector(".sub-menu");
            let subMenuItemList = [...subMenu.children[0].children];
            if (aside.contains(subMenu)) {
                subMenuItemList.forEach((item) => {
                    item.classList.add("off-menu");
                    item.classList.remove("on-menu");
                });
                setTimeout(function () {
                    aside.removeChild(subMenu);
                }, 500);
            }
        }
    }
    // open/close
    const openClass = "faq-content-open";
    $("div.faq-content").each(function () {
        const $content = $(".faq-content-open", this);
        const $parent = $(this);
        if (!$parent.hasClass(openClass)) {
            $content.hide();
        }
        $("a.title", this).click(function (e) {
            e.preventDefault();
            if (!$parent.hasClass(openClass)) {
                $content.slideDown();
            } else {
                $content.slideUp();
            }
            $parent.toggleClass(openClass);
        });
    });

    $('.eq-holder').each(function(){
        var $boxes = $('.eq-box', this);
        var checkHeight = function() {
            var maxHeight = 0;
            $boxes.css('min-height', 0);
            $boxes.each(function(){
                if ($(this).innerHeight() > maxHeight) {
                    maxHeight = $(this).innerHeight();
                }
            });
            $boxes.css('min-height', maxHeight);
        }
        if (window.innerWidth > mobSizeContent) {
            checkHeight();
        }
        $win.on('resize', function(){
            if (window.innerWidth > mobSizeContent) {
                checkHeight();
            }
        }).on('size:mc', function(){
            $boxes.css('min-height', 0);
        })
    });

    $win.on("resize", function () {
        if (window.innerWidth > mobSizeAside && $win.size !== "d") {
            $win.trigger("size:d");
            $win.size = "d";
        } else if (window.innerWidth <= mobSizeAside && $win.size !== "m") {
            $win.trigger("size:m");
            $win.size = "m";
        }
        if (window.innerWidth > mobSizeContent && $win.sizec !== "dc") {
            $win.trigger("size:dc");
            $win.sizec = "dc";
        } else if (window.innerWidth <= mobSizeContent && $win.sizec !== "mc") {
            $win.trigger("size:mc");
            $win.sizec = "mc";
        }
    }).trigger("resize");
});
