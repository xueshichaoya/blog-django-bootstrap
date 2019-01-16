$(document).ready(function () {
    var local_url = window.location.pathname;
    var blog_footer = $('#blog-footer');
    var header_container = $('.header-container');
    /**
     *1.0--首页
     */
    if ($('#index-page').length > 0) {

        /**
         * 设置归档按钮样式
         */
        $(".topnav").accordion({
            accordion: false,
            speed: 200,
            closedSign: '[+]',
            openedSign: '[--]'
        });

        /**
         * 初始化点击的归档按钮样式
         */
        function init_local_url_href() {
            if (local_url.indexOf("\/archives\/") === 0) {
                $(".widget-archives ul>li>a[href='" + local_url + "']").addClass("active-local-url")
            }
            if (local_url.indexOf("\/category\/") === 0) {
                $(".widget-category ul>li>a[href='" + local_url + "']").addClass("active-local-url")
            }
            if (local_url.indexOf("\/tag\/") === 0) {
                $(".widget-tag-cloud ul>li>a[href='" + local_url + "']").addClass("active-local-url")
            }

            var local_url_a = $("a.active-local-url");
            local_url_a.parent().parent().css("display", "block");
            local_url_a.parent().parent().prev().find("span:first").html('[--]');
        }

        init_local_url_href();


    }

    /**
     *2.0--文章详细页
     */
    if ($('#post-page').length > 0) {
        var title_list_li = $("ul.article-index li");
        if ($("article :header[id]").first().length > 0) {
            var article_first_top = $("article :header[id]").first().offset().top;
        }
        var article_index = $("ul.article-index");

        /**
         * 固定文章目录侧边栏
         */
        function init_titlelist_position() {
            var titlelist_fix_div = $("#side-fix");

            if (titlelist_fix_div.length > 0) {
                var side_padding_top = ($('.side').css('padding-top').replace('px', ''));
                var headerHeight = header_container.outerHeight(true) + 16 + parseInt(side_padding_top);
                var footerHeight = blog_footer.innerHeight() + 100;
                titlelist_fix_div.affix({
                    offset: {
                        top: headerHeight,
                        bottom: footerHeight
                    }
                }).on('affix.bs.affix', function () {
                    $(this).css({
                        /*'top': headerHeight,*/
                        'width': $(this).outerWidth()
                    });
                });
            }
        }

        init_titlelist_position();

        /**
         * 初始化文章目录html结构
         */
        function init_titlelist_structure() {
            title_list_li.filter(
                function (index) {
                    return ($(this).children(":first").is("a") && $(this).children(":last").is("ul"));
                }
            ).each(
                function (index) {
                    $(this).children(":first").wrap("<li></li>");
                    $(this).before($(this).children(":first"));
                    $(this).addClass("no-active");
                }
            );
        }

        init_titlelist_structure();

        var title_list = $(".body-container").find('ul.article-index [href^=\'#\']').parent();

        /**
         * 初始化文章目录样式
         */
        function init_titlelist_first() {
            if (title_list.length > 0) {
                if (($(document).scrollTop() >= 0) && ($(document).scrollTop() <= article_first_top)) {
                    title_list.eq(0).addClass("active");
                }
                if (article_index.prev(".highlight-title").length <= 0) {
                    article_index.before("<div class=\"highlight-title\" style=\"top: " + title_list.eq(0).position().top + "; height: " + title_list.eq(0).css('height') + "; display: block;\"></div>");
                }
            }
        }

        init_titlelist_first();


        /**
         *文章表格样式调整
         */
        function init_article_table() {
            var article_table = $("article table");
            if (article_table.length > 0) {
                article_table.addClass("table table-striped table-bordered table-hover blog-table");
                $("article table.blog-table").wrap("<div class=\"table-responsive\"></div>");
            }
        }

        init_article_table();

        /**
         * 滚动时设置文章目录样式
         */
        scrollFloor({
            floorClass: 'article [id]',
            navClass: 'ul.article-index [href^=\'#\']',
            activeClass: 'active',
            activeTop: 5,
            scrollTop: 0,
            delayTime: 200
        });

        }

    /**
     * 3.0--通用代码
     */

    /* 设定返回顶部按钮位置 */
    function back_to_top() {
        var scrollUp_top = header_container.outerHeight(true) + 100;
        var scrollUp_bottom = $(document).height() - window.innerHeight - blog_footer.innerHeight();
        bt = $('#back_to_top');

        if ($(document).width() > 480) {
            $(window).scroll(function() {
                var st;
                st = $(window).scrollTop();
                if (st > scrollUp_top) {
                    return bt.css('display', 'block');
                } else {
                    return bt.css('display', 'none');
                }
            });
            return bt.click(function() {
                $('body,html').animate({
                    scrollTop: 0
                }, 800);
                return false;
            });
        }

    }
    back_to_top();

    /*function set_backup_position() {
        var scrollUp_top = header_container.outerHeight(true) + 100;
        var scrollUp_bottom = $(document).height() - window.innerHeight - blog_footer.innerHeight();
        if ($(document).scrollTop() <= scrollUp_top) {
            $("#scrollUp").css("display", "none");
        } else if (($(document).scrollTop() > scrollUp_top) && ($(document).scrollTop() <= scrollUp_bottom)) {
            $("#scrollUp").addClass("back-top-affix").css({"display": "block", "bottom": 30});
        } else {
            var bottom_value = 30 + $(document).scrollTop() - scrollUp_bottom;
            $("#scrollUp").addClass("back-top-affix").css({"display": "block", "bottom": bottom_value});
        }
    }

    $(window).bind('scroll', function () {
        set_backup_position();
    });*/

    /*返回顶部平滑滚动*/
    function smooth_scroll() {
        var $root = $('html, body');
        $('#scrollUp').click(function () {
            $('html, body').animate({
                scrollTop: $($.attr(this, 'href')).offset().top
            }, 400);
            return false;
        });
    }

    smooth_scroll();


});


