(function (window) {
    var defaults = {
        floorClass: 'article [id]',
        navClass: 'ul.article-index [href^=\'#\']',
        activeClass: 'active',
        activeTop: 0,
        scrollTop: 0,
        delayTime: 200
    };

    var $body = $(".body-container");
    var data = [];
    var article_index = $("ul.article-index");
    var highlight_title = $(".highlight-title");


    function getItem(_list, newOptions) {
        _list.each(function () {
            var item = {};
            item.$obj = $body.find(this);
            item.$activeTop = $body.find(this).offset().top - newOptions.activeTop;
            item.$scrollTop = $body.find(this).offset().top + newOptions.scrollTop;
            data.push(item);
        });
    }

    function scrollActive(_list, newOptions) {
        var nowScrollTop = $(window).scrollTop();
        highlight_title = $(".highlight-title");
        var active_now = $("li.active");
        var a_i = _list.index(active_now);

        var ii = 0;
        // $.each(data,function(i,item)) 用来循环数组
        $.each(data, function (i, item) {
            if (nowScrollTop >= item.$activeTop) {
                _list.removeClass(newOptions.activeClass).eq(i).addClass(newOptions.activeClass);
                ii = i;
            }
        });

        function set_highlight_title_css() {
            if (ii !== a_i) {
                highlight_title.css({
                    "top": _list.eq(ii).position().top,
                    "height": _list.eq(ii).css('height'),
                    "display": "block"
                });
            }
        }

        set_highlight_title_css();
    }

    var scroll_floor = window.scrollFloor = function (options) {
        var newOptions = $.extend({}, defaults, options);
        var floorList = $body.find(newOptions.floorClass), navList = $body.find(newOptions.navClass).parent();


        getItem(floorList, newOptions);
        scrollActive(navList, newOptions);

        $(window).bind('scroll', function () {
            scrollActive(navList, newOptions);
        });

        //smooth_scroll();
        navList.bind('click', function (e) {
            var _index = navList.index(this);
            $('html,body').animate({'scrollTop': data[_index].$scrollTop}, newOptions.delayTime);
            return false;
            //e.preventDefault();
        });

    }
})(window);
