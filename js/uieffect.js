$(function(){

  const _html = $('html');
  const _body = $('body');
  const _window = $(window);

  var ww = _window.width();
  var wwNew = ww;

  const wwSlim= 400; //更窄螢幕
  const wwMedium = 700; //此值以下是手機
  const wwNormal = 1100; //此值以上是電腦
  const wwMaximum = 1680; // 最大寬度

  const _siteHeader = $('.siteHeader');
  const _siteFooter = $('.siteFooter');
  const _menu = _siteHeader.find('.menu'); // 寬版主選單
  const _sidebar = $('.sidebar');          // 行動版側欄
  const _sidebarCtrl = $('.sidebarCtrl');  // 控制行動版側欄開合
  const _fatFootCtrl = $('.fatFootCtrl');  // 控制 fatfoote 開合

  const _goTop = $('.goTop');
  const _goCenter = $('.goCenter');


  // _html.removeClass('no-js');


  // 製作側欄選單遮罩
  // --------------------------------------------------------------- //
  _body.append('<div class="sidebarMask"></div>');
  const _sidebarMask = $('.sidebarMask');
  // --------------------------------------------------------------- //


  // 找出_menu中有次選單的li 
  // --------------------------------------------------------------- //
  _menu.find('li').has('ul').addClass('hasChild');
  var _hasChildA = _menu.find('.hasChild').children('a');
  _hasChildA.attr('role', 'button').attr('aria-expanded', false);

  // 行動版側欄
  // --------------------------------------------------------------- //

  // 找出_menu中有次選單的li 
  _menu.find('li').has('ul').addClass('hasChild');
  var _hasChildA = _menu.find('.hasChild').children('a');
  _hasChildA.attr('role', 'button').attr('aria-expanded', false);
  _menu.clone().prependTo(_sidebar);  // 複製「主選單」到側欄給行動版用
  
  // 行動版「主選單」 
  // --------------------------------------------------------------- //
  // $('.headNav').clone().appendTo(_sidebar);  // 複製「topLinks」到側欄給行動版用

  const _sidebarMenu = _sidebar.find('.menu');
  var _hasChildMobile = _sidebarMenu.find('.hasChild>a');

  // 行動版側欄，顯示／隱藏
  // --------------------------------------------------------------- //
  var _sidebarA = _sidebar.find('a, button');
  const _sidebarA_first = _sidebarA.eq(0);
  const _sidebarA_last = _sidebarA.eq(_sidebarA.length - 1);

  // 點擊漢堡圖示
  _sidebarCtrl.on('click' ,function(){
    if (_sidebar.is(':visible')) {
      _sidebar.removeClass('reveal');
      _sidebarCtrl.removeClass('closeIt');
      _sidebarMask.fadeOut(500, function(){
        _sidebar.removeAttr('style');
        _body.removeClass('noScroll');
      });
    } else {
      _sidebar.css('top', _siteHeader.innerHeight()).show(10, 
        function(){ 
          _sidebar.addClass('reveal');
        } 
      );
      _sidebarCtrl.addClass('closeIt');
      _sidebarMask.fadeIn(500);
      _body.addClass('noScroll');
    }
  })

  // 點擊遮罩，隱藏側欄
  _sidebarMask.on( 'click', function(){
    _sidebar.removeClass('reveal');
    _sidebarCtrl.removeClass('closeIt');
    $(this).fadeOut(500, function(){
      _sidebar.hide();
      _body.removeClass('noScroll');
    });
  })

  // 鍵盤 Tab
  _sidebarCtrl.on('keydown', function(e){
    if ( e.code == 'Tab' && _sidebar.is(':visible') ) {      
      if(!e.shiftKey) {
        e.preventDefault();
        _sidebarA_first.trigger('focus');
      } else {
        e.preventDefault();
      }
    }
  })

  _sidebarA_last.on('keydown', function(e){
    if ( e.code == 'Tab' && !e.shiftKey ) {
      e.preventDefault();
      _sidebarCtrl.trigger('focus');
    }
  })

  _sidebarA_first.on('keydown', function(e){
    if ( e.code == 'Tab' && e.shiftKey ) {
      e.preventDefault();
      _sidebarCtrl.trigger('focus');
    }
  })
  // --------------------------------------------------------------- //



  // 行動版側欄「主選單」開合
  // --------------------------------------------------------------- //
  _hasChildMobile.on( 'click', function(e){
    e.preventDefault();
    
    let _this = $(this);
    let _subMenu = _this.next('ul');

    if (_subMenu.is(':hidden')) {
      _subMenu.stop(true, false).slideDown();
      _this.attr('aria-expanded', true).parent().addClass('closeIt').siblings().removeClass('closeIt').find('ul:visible').slideUp().parent().removeClass('closeIt').children('a').attr('aria-expanded', false);
    } else {
      _subMenu.stop(true, false).slideUp().find('ul:visible').slideUp();
      _subMenu.find('.closeIt').removeClass('closeIt').children('a').attr('aria-expanded', false);
      _this.attr('aria-expanded', false).parent().removeClass('closeIt');
    }
  })
  // --------------------------------------------------------------- //



  // 寬版「主選單」
  // --------------------------------------------------------------- //
  var _topItem = _menu.children('ul').children('li'); // 第一層選單項
  var _hasChild = _menu.find('.hasChild');
  var _hasChildA = _hasChild.children('a');
  var liA = _menu.find('li>a');

  _hasChildA.each( function(){
    let _this = $(this);
    let _thisParentLi = _this.parent('li');
    let _thisSubMenu = _this.next('ul');
    let _xButtonDown;
    let _xButtonUp;
    const speed = 200;

    _this.on('mouseenter focus', function(){
      let y1 = _window.height() + _window.scrollTop(); //視窗高度＋已捲動到視窗之上的文件高度
      let y2; // 將存放次選單高度 ＋ 次選單距離文件最上方的垂直距離
      let translate = ''; // 次選單需移動的垂直距離
      let dd = 0;
      let dy = 0; // 次選單超出視窗的高度
  
      _this.attr('aria-expanded', true);
      _thisParentLi.addClass('here'); // 為已展開的次選單上層li加樣式

      _thisSubMenu.stop(true, false).slideDown(speed, function(){
        y2 = _thisSubMenu.outerHeight() + _thisSubMenu.offset().top;
        const itemHeight = parseInt(_thisSubMenu.find('li:first-child').outerHeight());

        // 判斷「次選單底部」是否超過「視窗底部」
        if ( y2 > y1) {
          // 判斷「次選單高度」是否超過「視窗高度」
          if (_thisSubMenu.outerHeight() <= _window.height()){
            // 次選單高度沒有超過視窗高度，移動次選單使「次選單底部」對齊「視窗底部」
            translate = 'translateY(' + String( y1 - y2 ) + 'px)';
          } else {
            // 「次選單高度」超過「視窗高度」，移動次選單使其頂部對齊「視窗頂部」
            translate = 'translateY(' + String( _window.scrollTop() - _thisSubMenu.offset().top) + 'px)';

            // dy = 選單高度 - 視窗高度
            dy =  parseInt(_thisSubMenu.outerHeight() - _window.height());

            // 加入控制 button
            _this.append('<button class="upward" disabled type="button"></button><button class="downward" type="button"></button>');
            _xButtonDown = _this.find('button.downward');
            _xButtonUp = _this.find('button.upward');
            _xButtonDown.add(_xButtonUp).css('left', _thisSubMenu.offset().left + _thisSubMenu.outerWidth());
          }
        }
        _thisSubMenu.css('transform', translate );

        if ( typeof _xButtonDown !== 'undefined') {
          _xButtonDown.on( 'click',  function(){
            if ( dd + dy > 0) {
              dd = dd - itemHeight;
              if (dd + dy < itemHeight) {
                dd = -1*dy ;
                _xButtonDown.attr('disabled', 'disabled');
              }
              _thisSubMenu.stop(true, false).animate({'margin-top': dd}, 200);
              _xButtonUp.removeAttr('disabled');
            }
          })
        }
        if ( typeof _xButtonUp !== 'undefined') {
          _xButtonUp.on( 'click',  function(){
            if ( dd < 0 ) {
              dd = dd + itemHeight;
              if ( -1*dd < itemHeight) {
                dd = 0;
                _xButtonUp.attr('disabled', 'disabled');
              }
              _thisSubMenu.stop(true, false).animate({'margin-top': dd}, 200);
              _xButtonDown.removeAttr('disabled');
            }
          })
        }

      });
      // ----------------------------------------


      

      // 判斷展開的次選單是否超過視窗右邊界
      if ( _thisSubMenu.offset().left + _thisSubMenu.outerWidth() > _window.width()) {
        if ( _thisParentLi.is(_topItem) ) {
          _thisSubMenu.css({ right:0, left: 'auto'});
        } else {
          _thisSubMenu.css({ right: _this.outerWidth(), left: 'auto'});
          _thisParentLi.addClass('turn'); // 讓箭頭轉向
        }
      }
      // ----------------------------------------
        
    })

    _thisParentLi.on('mouseleave' , function(){
      _this.attr('aria-expanded', false).blur();
      _thisParentLi.removeClass('turn here').find('button').remove();
      _thisSubMenu.stop(true, false).slideUp(speed, function(){
        _thisSubMenu.removeAttr('style');
      })
    })

  });

  liA.on( 'focus', function(){
    $(this).parent('li').siblings().removeClass('here turn').find('ul').hide().end().filter('.hasChild').children('a').attr('aria-expanded', false);
  })



  // 離開 _menu 隱藏所有次選單
  $('*').on( 'focus', function(){
    if( $(this).parents('.menu').length == 0 ){
      _menu.find('.hasChild').removeClass('here').find('ul').removeAttr('style');
      _menu.find('.hasChild').children('a').attr('aria-expanded', false);
    }
  })



  // fatfooter 開合
  // --------------------------------------------------------------- //
  var _footSiteTree = $('.fatFooter').find('.siteTree>ul>li>ul');

  _fatFootCtrl.attr('aria-label', '導覽選單').removeAttr('data-alttext');

  _footSiteTree.is(':hidden') ? _fatFootCtrl.addClass('closed').attr('aria-expanded', false) :  _fatFootCtrl.removeClass('closed').attr('aria-expanded', true);

  _fatFootCtrl.on( 'click', function(){
    if ( _footSiteTree.is(':visible') ) {
      _footSiteTree.slideUp(400, function(){
        _fatFootCtrl.addClass('closed').attr('aria-expanded', false);
      });
    } else {
      _footSiteTree.slideDown();
      _fatFootCtrl.removeClass('closed').attr('aria-expanded', true);
    }
  })
  // --------------------------------------------------------------- //



  // 回到頁面頂端 Go Top
  // --------------------------------------------------------------- //
  _goTop.on( 'click', function(){
    _html.stop(true,false).animate({scrollTop: 0}, 800, function(){
      _goCenter.trigger('focus');
    });
  });



  // 固定版頭 
  // --------------------------------------------------------------- //
  // var fixHeadThreshold;
  let hh = _siteHeader.innerHeight();

  // if ( ww >= wwNormal) {
  //   fixHeadThreshold = hh;
  // } else {
  //   fixHeadThreshold = 0;
  // }

  // 瀏覽器卷動 scroll 事件
  _window.on('scroll', function(){
    if (_window.scrollTop() > 0 ) {
      _siteHeader.addClass('fixed');
      _body.offset({top: hh});
      _goCenter.trigger('blur');
    } else {
      _siteHeader.removeClass('fixed');
      _body.removeAttr('style');
    }

    // goTop button 顯示、隱藏
    _window.scrollTop() > 200 ? _goTop.addClass('show') :  _goTop.removeClass('show');
  })
  _window.trigger('scroll');
  // --------------------------------------------------------------- //

  // 點擊展開的複合功能圖示
  // --------------------------------------------------------------- //
  // 文字大小、分享
  var _compIcon = $('.compound'); //li
  _compIcon.each(function(){
    let _this = $(this);
    let _controler = _this.children('button');
    let _optList = _this.children('ul');
    let _optItem = _optList.children('li');
    let _optButton = _optItem.children('button');
    let _optLink = _optItem.children('a');
    let count = _optItem.length;

    const speed = 300;

    // 改變 li 的 z-index 值，第一個 li 要在最上面
    for (let i = 0; i < count; i++) {
      _optItem.eq(i).css('z-index', count - i)
    }

    // 收合
    function glideUp() {
      for (let i = 0; i < count; i++) {
        _optList.stop(true, false).animate({ 'top': 0 }, speed);
        _optItem.eq(i).delay( speed * i * .4).stop(true, false).animate({ 'top': 0 }, speed, function(){
          if ( i == count-1) {_optList.height(0).hide()}
        });
      }
    }

    _controler.on( 'click', function(){
      if (_optList.is(':hidden')) {
        _optList.show();
        let height = _optItem.outerHeight(true);
        _optList.stop(true, false).animate({ 'top': height }, speed);
        for (let i = 0; i < count; i++) {
          _optItem.eq(i).delay( speed*i*.3 ).stop(true, false).animate({ 'top': height * i }, speed, function(){
            _optList.height( height * count);
          })
        }
      } else {
        glideUp();
      }
    })

    _optButton.add(_optLink).on( 'click', glideUp);
    _this.siblings().on( 'click', glideUp);
    _this.siblings().children('a, button').focus(glideUp);
    _optItem.last().children('button').on('keydown', function(e){
      if( e.which === 9 && !e.shiftKey ) {
        glideUp();
      }
    });
  })
  // 複合功能圖示 end ---------------------------------------------- //


  // lp 頁上方可收合查詢區 
  // --------------------------------------------------------------- //
  const _showHideSearch = $('.searchOnLp');
  var _drawer = $('.drawer');
  _drawer.each(function () {
    let _this = $(this);
    let _handle = _this.find('button.handle');
    let _tray = _this.find('.tray');
    const speed = 500;
    const text1 = "顯示查詢條件";
    const text2 = "隱藏查詢條件";

    _handle.attr('aria-label', "查詢開關");

    if ( _tray.is(':hidden')) {
      _handle.addClass('openIt').attr('aria-expanded', false);
      if (_this.is(_showHideSearch) ) {_handle.text(text1)}
    } else {
      _handle.removeClass('openIt').attr('aria-expanded', true);
      if (_this.is(_showHideSearch) ) {_handle.text(text2)}
    }

    _handle.on('click', function () {
      if (_tray.is(':hidden')) {
        _tray.stop(true, false).slideDown(speed);
        _handle.removeClass('openIt').attr('aria-expanded', true);
        if (_this.is(_showHideSearch) ) {_handle.text(text2)}
      } else {
        _tray.stop(true, false).slideUp(speed, function(){
          _handle.addClass('openIt').attr('aria-expanded', false);
          if (_this.is(_showHideSearch) ) {_handle.text(text1)}
        })
      }
    })
  })


  // --------------------------------------------------------------- //
  // ------------------- 外掛套件 slick 參數設定 ----------------------- //
  // --------------------------------------------------------------- //
  
  // 【暫停／輪播】按鈕元件
  const ppButton = '<button class="pausePlay" aria-label="暫停輪播" data-altLabel="繼續輪播"></button>';

  // 首頁：檔案 時光流轉的故事
  // --------------------------------------------------------------- //
  const _stories = $('.story-in-archive').find('.flow');
  _stories.before(ppButton); // 加入【暫停／輪播】按鈕

  _stories.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 6000,
    speed: 800,
    autoplay: true,
    arrows: true,
    dots: false,
    infinite: true,
    mobileFirst: true,
    centerMode: false,
    prevArrow: $('.story-in-archive .slick-prev'),
    nextArrow: $('.story-in-archive .slick-next'),
    appendArrows: $('.story-in-archive .slickArrows'),
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2
        }
      },
      // {
      //   breakpoint: 1720,
      //   settings: {
      //     slidesToShow: 3
      //   }
      // }
    ]
  });
  // --------------------------------------------------------------- //


  // 首頁：推薦檔案
  // --------------------------------------------------------------- //
  const _recommend = $('.recommend').find('.flow');
  _recommend.before(ppButton); // 加入【暫停／輪播】按鈕

  _recommend.slick({
    slidesToShow: 1.1,
    slidesToScroll: 1,
    autoplaySpeed: 6000,
    speed: 800,
    autoplay: true,
    arrows: true,
    dots: false,
    fade: false,
    infinite: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 4
        }
      }
    ]
  });
  // --------------------------------------------------------------- //


  // 內頁「主題專區」：主題檔案
  // --------------------------------------------------------------- //
  const _theme_archive = $('.theme-archive').find('.flow');
  _theme_archive.before(ppButton); // 加入【暫停／輪播】按鈕

  _theme_archive.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 6000,
    speed: 1000,
    autoplay: true,
    arrows: true,
    dots: false,
    fade: false,
    infinite: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 4
        }
      }
    ]
  });
  // --------------------------------------------------------------- //

  // 內頁「主題專區」：主題講座
  // --------------------------------------------------------------- //
  const _theme_lecture = $('.theme-lecture').find('.flow');
  _theme_lecture.before(ppButton); // 加入【暫停／輪播】按鈕

  _theme_lecture.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 6000,
    speed: 1000,
    autoplay: true,
    arrows: true,
    dots: false,
    fade: false,
    infinite: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  });
  // --------------------------------------------------------------- //
  
  // 內頁「主題專區」：教學資源
  // --------------------------------------------------------------- //
  const _theme_eduSource = $('.theme-eduSource').find('.flow');
  _theme_eduSource.before(ppButton); // 加入【暫停／輪播】按鈕

  _theme_eduSource.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 6000,
    speed: 1000,
    autoplay: true,
    arrows: true,
    dots: false,
    fade: false,
    infinite: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  });
  // --------------------------------------------------------------- //

    // 檔案詳細內容頁：圖檔輪播
  // --------------------------------------------------------------- //
  const _photoShow = $('.photoSlide').find('.photoShow');
  const _photoNav =  _photoShow.siblings('.photoNav');
  const phsLength = _photoShow.find('.flowItem').length;

  _photoShow.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: _photoNav,
    autoplaySpeed: 5000,
    speed: 800,
    autoplay: true,
    dots: true,
    arrows: false,
    fade: false,
    infinite: true,
    mobileFirst: true
  });

  // 小圖區
  _photoNav.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: _photoShow,
    arrows: true,
    dots: false,
    fade: false,
    infinite: true,
    centerMode: true,
    focusOnSelect: true,
    variableWidth: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: wwMedium,
        settings: {
          slidesToShow: 5,
        }
      }
    ]
  })

  _photoShow.append('<div class="total">' + phsLength +'</div>');

  // --------------------------------------------------------------- //


  // 檔案詳細內容頁「相關檔案」
  // --------------------------------------------------------------- //
  const _relatedFiles = $('.relatedFiles').find('.flow');

  _relatedFiles.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 4000,
    speed: 800,
    autoplay: false,
    arrows: true,
    dots: true,
    fade: false,
    infinite: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: wwNormal,
        settings: {
          slidesToShow: 4
        }
      }
    ]
  });
  // --------------------------------------------------------------- //


  // --------------------------------------------------------------- //
  // slick 【暫停／輪播】按鈕功能
  // --------------------------------------------------------------- //
  let _pausePlay = $(".pausePlay");
  
  _pausePlay.each( function () {
    let _thisPP = $(this);
    let _thisSlick = _thisPP.siblings('.slick-slider'); // 找到對應的 slick-slider 元素
    let isSlickPaused = false;
    const label0 = _thisPP.attr('aria-label');      // 暫停時的 aria-label
    const label1 = _thisPP.attr('data-altLabel');   // 播放時的 aria-label
  
    // 點擊暫停／播放按鈕
    _thisPP.on('click', function () {
      if (_thisPP.hasClass('paused')) {
        // 如果目前是暫停狀態，則恢復播放
        _thisPP.removeClass('paused').attr('aria-label', label0);
        _thisSlick.slick('slickPlay');
        isSlickPaused = false;
      } else {
        // 如果目前是播放狀態，則暫停輪播
        _thisPP.addClass('paused').attr('aria-label', label1);
        _thisSlick.slick('slickPause');
        isSlickPaused = true;
      }
    });
  
    // 監聽 slick 的 breakpoint 事件，當 isSlickPaused = true 暫停輪播
    // ⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎ //
    // 進入斷點時 Slick 會重新初始化，autoplay 狀態會被重新啟動，
    // 所以需要在斷點事件中檢查 isSlickPaused 狀態，
    // 如果 isSlickPaused 為 true，執行 slickPause。
    // ⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎⭐︎ //
    _thisSlick.on('breakpoint', function () {
      if (isSlickPaused) {
        _thisSlick.slick('slickPause');
      }
    });
  
  });
  // --------------------------------------------------------------- //
  
  
  // --------------------------------------------------------------- //
  // --------------- 外掛套件 slick 參數設定 END ------------------- //
  // --------------------------------------------------------------- //






})



