var windowWidth = $(window).width() + 17;
var windowHeight = $(window).height();
var documentHeight = $(document).height() - 140;
var isMobile = is_mobile();
var scrollTop;
var navBG = document.getElementById("navBG");

function is_mobile() {
  if (/Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}

// fix position header

var heroOffsetTop = $(".hero__container").offset().top;

var imgsrc = $('.loader__gif').attr('src');

$(document).ready(
  function(){
    $(".loader").delay(3000).fadeOut("slow", function(){
      $('.loader__gif').attr('src', '');
    });
    if(heroOffsetTop > windowHeight * 2){
      $(".hero__container").css('top', '-100%');
      if(windowWidth > 640 && !isMobile){
        $(".nav").css('bottom', '100%');
      }
    }
    if(windowWidth > 1080){
      $("footer").addClass("fixed");
    }
    $(".hero__container").css("opacity", "1");
  }
);

var instagram = {
  token: "1975026352.c6e2de8.3ef7709ab1e847beb0b6805c7c985fad",
  count: '&count=4',
  template: Handlebars.compile($("#insta-template").html()),
  clientX: undefined,
  overlayOn: false,
  request: function(){
    if(windowWidth < 640 && windowHeight > 480){
      this.count = '&count=2';
    }
    if(windowWidth > 1080 && windowHeight > 700){
      this.count = '&count=6';
    }
    if(windowWidth > 1280 && windowHeight > 910){
      this.count = '&count=8';
    }
    $.getJSON('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + this.token + this.count)
        .done( function(data) {
          var insta = this.template(data);
          $('.instagram__wrapper').append(insta);
        }.bind(this))
        .fail (function() {
          $('.instagram').css('display', 'none');
    });
    this.opening();
    this.mouseReaction();
  },
  opening: function(){
    $(".instagram__triangle").on("click", function(ev){
      if($(".projectSheet__modal").hasClass("open")){
        $(".instagram").toggleClass("open");
      }
      if(this.overlayOn === false){
        $(".instagram, .overlay").addClass("open");
        this.overlayOn = true;
      } else if(!$(".projectSheet__modal").hasClass("open")) {
        $(".instagram, .overlay").removeClass("open");
        this.overlayOn = false;
      }
    }.bind(this));
  },
  updatePosition: function(ev){
    if(windowWidth > 640 && !isMobile){
      instagram.clientX = ev.pageX / windowWidth;
      if(instagram.clientX > 0.75){
        $(".instagram").addClass("peak");
      } else {
        $(".instagram").removeClass("peak");
      }
    }
  },
  mouseReaction: function(){
    $("body").mousemove(_.throttle(this.updatePosition, 300));
  }
};

instagram.request();

var decoTile = {
  lineCount: undefined,
  maxTile: undefined,
  tileCount: 0,
  increase: true,
  lineNumber: 0,
  line: undefined,
  lineTop: 0,
  creaLines: function(){
    $(".content__deco").each(
      function(){
        decoTile.lineCount = $(this).data("lines");
        for(var i = 0; i < decoTile.lineCount; i++){
          $(this).append('<div class="line"></div>');
        }
        decoTile.maxTile = (decoTile.lineCount + 1) / 2;
        if(windowWidth < 1080){
          $(this).css('width', decoTile.maxTile * 60);
          $(this).css('height', decoTile.maxTile * 60);
        } else if (windowWidth > 1080){
          $(this).css('width', decoTile.maxTile * 80);
          $(this).css('height', decoTile.maxTile * 80);
        }
        decoTile.tileCount = 0;
        decoTile.increase = true;
        decoTile.lineNumber = 0;
        $(this).find(".line").each(
          function(){
            var $line = $(this);
            var lineTop = 0;
            decoTile.lineNumber ++;
            if(windowWidth < 1080){
              lineTop = decoTile.lineNumber * 30 + 'px';
            } else if (windowWidth > 1080){
              lineTop = decoTile.lineNumber * 40 + 'px';
            }
            $line.css('top', lineTop);
            if(decoTile.tileCount < decoTile.maxTile && decoTile.increase){
              decoTile.tileCount += 1;
            } else {
              decoTile.tileCount -= 1;
              decoTile.increase = false;
            }
            for(var i = 0; i < decoTile.tileCount; i++){
              $line.append('<div class="tile"></div>');
            }
          }
        );
      }
    );
  },
  anim : function(){
    $(".tile").mouseover(
    	function(){
        if(windowWidth > 640 && !isMobile){
          if($(this).hasClass("hover") === false){
          	var $this = $(this);
          	$this.addClass("hover");
          	setTimeout(function(){
          	$this.removeClass("hover");
          	}, 1200);
          }
        }
      }
    );
  },
  init: function(){
    this.creaLines();
    this.anim();
  }
};

decoTile.init();

var scrollAnim = {
  $body: $("body"),
  $html: $("html"),
  $hero: $(".hero"),
  $imgHero: $(".hero__anim"),
  $hero__container: $(".hero__container"),
  $deco__left: $(".content__deco--left"),
  $deco__right: $(".content__deco--right"),
  $nav: $(".nav"),
  $navBG: $(".navBG"),
  $instagram: $(".instagram"),
  $projects: $(".projects"),
  $projectSheet: $(".projectSheet"),
  $gallery: $(".gallery"),
  $main: $("main"),
  $footer: $("footer"),
  $bgLight: $(".bg--light"),
  $petale: $("#petale"),
  $scrolldown: $(".scrolldown"), // flèche vers le bas
  instagramRight: undefined,
  deco__leftTop: undefined,
  deco__rightBottom: undefined,
  scrollLevel: undefined,
  gifAnim: undefined,
  parallaxWeb: undefined,
  navBGin: false,
  heroScrolled: false,
  isBeforeSnap: false,
  isAfterSnap: false,
  scroll: function(){
    this.scrollLevel = $(window).scrollTop();
    if(this.scrollLevel > 0){
      this.$scrolldown.addClass("gone");
    }
    if(windowWidth > 640 && !isMobile){
      if(this.scrollLevel > 0){
        this.$hero__container.css('top', '45%');
        this.$nav.css('bottom', '0');
        if(windowWidth > 1080){
          this.instagramRight = "-350px";
          this.deco__leftTop = "-250px";
          this.deco__rightBottom = "-50px";
        } else if(windowWidth > 720){
          this.instagramRight = "-50vw";
        } else {
          this.instagramRight = "-90vw";
          this.deco__leftTop = "-300px";
          this.deco__rightBottom = "0";
        }
        this.$deco__left.css("top", this.deco__leftTop);
        this.$deco__right.css("bottom", this.deco__rightBottom);
        if(this.$instagram.hasClass("open") === false){
          this.$instagram.css('right', this.instagramRight);
        }
      }
      this.gifAnim = Math.floor(this.scrollLevel / 500 * 25);
      if(this.gifAnim < 25){
        if(this.gifAnim < 10){
          this.gifAnim = '0' + this.gifAnim.toString();
        }
        this.$imgHero.attr('src', 'img/header/gif-header' + this.gifAnim + '.png');
      } else {
        this.$imgHero.attr('src', 'img/header/gif-header25.png');
      }
    }
    if(this.scrollLevel > 600){
      this.$petale.addClass("animPetale");
      this.heroScrolled = true;
      if(windowWidth > 1080){
        if(windowHeight > 750){
          console.log(-this.$projectSheet.height());
          this.$projectSheet.addClass("fixed");
          this.$projectSheet.css({
            'top': '-45px',
            'right': '50%'
          });
          this.$gallery.css({
            'left': '450px',
            'min-height': windowHeight
          });
        }
        this.$footer.css({
          'left': '-200px',
          'bottom': '-200px'
        });
        this.$bgLight.css('display', 'block');
        this.$deco__left.addClass("fixed");
        this.$deco__right.addClass("fixed");
      }
      if(windowWidth > 640 && !isMobile){
        this.$nav.addClass("headDown");
        this.$hero__container.css('top', '-100%');
      }
    } else {
      this.$petale.removeClass("animPetale");
      this.heroScrolled = false;
      if(windowWidth > 1080){
        if(windowHeight > 750){
          this.$projectSheet.removeClass("fixed");
          this.$projectSheet.css({
            'top': 0,
            'right': 0
          });
          this.$gallery.css({
            'left': 'auto',
            'min-height': 'auto'
          });
        }
        this.$footer.css({
          'left': '-450px',
          'bottom': '-450px'
        });
        this.$bgLight.css('display', 'none');
        this.$deco__left.removeClass("fixed");
        this.$deco__right.removeClass("fixed");
      }
      if(windowWidth > 640 && !isMobile){
        this.$nav.removeClass("headDown");
        this.$hero__container.css('top', '60%');
        this.$hero__container.css('top', '45%');
      }
    }
    if(this.scrollLevel >= this.$hero.height() + 50 || this.scrollLevel + windowHeight > documentHeight - 100){
      if(windowWidth > 640 && !isMobile){
        this.$nav.addClass("main");
        this.$navBG.removeClass("hide");
        this.navBGin = true;
      }
    } else {
      if(windowWidth > 640 && !isMobile){
        this.$nav.removeClass("main");
        if(this.navBGin === true){
          this.$navBG.addClass("hide");
          this.navBGin = false;
        }
      }
    }
  },
  init: function(){
    window.addEventListener('scroll', _.throttle(this.scroll, 40).bind(this));
  }
};

scrollAnim.init();

$(document).ajaxStop(function() {
  scrollAnim.$projectSheet = $(".projectSheet");
  scrollAnim.$gallery = $(".gallery");
  scrollAnim.init();
});

var animLogo = {
  gifLogo: 0,
  maxGifLogo: 42,
  finished: true,
  mainInterval: undefined,
  animLogo: function(){
    if(animLogo.gifLogo > animLogo.maxGifLogo){
      clearInterval(animLogo.mainInterval);
      animLogo.finished = true;
    } else {
      animLogo.finished = false;
      if(animLogo.gifLogo < 10){
        $(".nav__img").attr('src', 'img/logo/logo0' + animLogo.gifLogo + '.png');
      } else {
        $(".nav__img").attr('src', 'img/logo/logo' + animLogo.gifLogo + '.png');
      }
      animLogo.gifLogo += 1;
    }
  },
  init: function(){
    $(".nav__logo").mouseenter(function(){
      if(this.finished && windowWidth > 640 && !isMobile){
        this.mainInterval = setInterval(this.animLogo, 50);
        this.gifLogo = 0;
        this.finished = false;
        this.animLogo();
      }
    }.bind(this));
  }
};

animLogo.init();

$(".burger").click(
  function(){
    $(this).toggleClass("clicked");
    if($(this).hasClass("clicked")){
      $(".nav").addClass("down");
      $(".nav").removeClass("up");
    } else {
      $(".nav").addClass("up");
      $(".nav").removeClass("down");
    }
  }
);

var modal = {
  modalOpen: function(){
    $(".projectSheet__modal, .overlay").addClass("open");
    instagram.overlayOn = true;
  },
  modalClose: function(){
    $(".projectSheet__modal, .overlay").removeClass("open");
    instagram.overlayOn = false;
  },
  init: function(){
    $(document).on('click', ".projectSheet__description__opening", function(){
        this.modalOpen();
      }.bind(this)
    );
    $(document).on('click', ".projectSheet__modal__close", function(){
        this.modalClose();
      }.bind(this)
    ).bind(this);
    $(".overlay").click(
      function(){
        this.modalClose();
        $(".instagram").removeClass("open");
        $(".burger").removeClass("clicked");
        $(".nav").addClass("up");
        $(".nav").removeClass("down");
      }.bind(this)
    );
    $(document).keyup(function(e) {
         if (e.keyCode == 27) {
           this.modalClose();
        }
    }.bind(this));
  }
};

modal.init();

// appel ajax

var isHome = false;

$(document).on('click', '.ajax-call', function(e){
  var url = window.location.href;
  if($(this).hasClass('backtotop')){
    isHome = true;
  } else {
    isHome = false;
  }
  e.preventDefault();
  var href = this.href;
  var id = this.getAttribute('data-id');
  switchPage(href, function(){ window.history.pushState({page: href},"", href);}, id);
});

function switchPage(href, cb, id){
  $('.loader__gif').attr('src', imgsrc);
  $(".loader").css("display", "flex");
  $.get(href)
      .done(function(data){
          $('main').empty();
          var html = $(data).filter('main').children();
          $('main').html(html);
          $(".loader").delay(1500).fadeOut("fast", function(){
            $('.loader__gif').attr('src', '');
          });
          if(windowWidth < 640 || isMobile){
            scrollTop = $(".hero").height() + 450;
          } else if(isHome === true){
            scrollTop = 0;
            isHome = false;
          } else {
            scrollTop = $(".hero").height() + 50;
          }
          $("html").animate({
            scrollTop: scrollTop
          }, 800);
          if(windowWidth < 640 || isMobile && $(".burger").hasClass("clicked")){
            $(".burger").removeClass("clicked");
            $(".nav").addClass("up");
            $(".nav").removeClass("down");
          }
      }).fail(function(){
          alert("error");
          $(".loader").delay(1500).fadeOut("fast", function(){
            $('.loader__gif').attr('src', '');
          });
      });
  document.body.id = id;
  if(cb){
    cb();
  }
}

window.addEventListener('popstate', function(e) {
  // e.state is equal to the data-attribute of the last image we clicked
  if(e.state){
      switchPage(e.state.page);
  }
});

window.addEventListener('orientationchange', function() {
  location.reload(forceGet);
}, false);

var petale = document.getElementById("petale");

petale.addEventListener("webkitAnimationStart", function(){
  scrollTop = $(".hero").height() + 50;
  if(windowWidth > 640 && !isMobile){
    $("html").animate({
      scrollTop: scrollTop
    }, 800);
  }
});

petale.addEventListener("animationstart", function(){
  scrollTop = $(".hero").height() + 50;
  if(windowWidth > 640 && !isMobile){
    $("html").animate({
      scrollTop: scrollTop
    }, 800);
  }
});

navBG.addEventListener("webkitAnimationStart", function(){
  if($(".navBG").hasClass("hide") && !isMobile && windowWidth > 640){
    $("html").animate({
      scrollTop: 0
    }, 800);
  }
});

navBG.addEventListener("animationstart", function(){
  if($(".navBG").hasClass("hide") && !isMobile && windowWidth > 640){
    $("html").animate({
      scrollTop: 0
    }, 800);
  }
});
