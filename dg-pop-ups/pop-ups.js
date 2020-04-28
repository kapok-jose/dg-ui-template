/*
    基于Jquery的mask插件
    dg-pop-ups.js 
    V1.1.0   
    Jose
    增加对齐方式
*/
; (function (root, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'), root);
    } if (typeof define === "function") {
        if (define.cmd) {
            define(function (require, exports, module) {
                var $ = require("jquery");
                factory($, root);
            });
        } else {
            define(["jquery"], function ($) {
                factory($, root);
            });
        }
    } else {
        factory(root.jQuery, root);
    }
}(typeof window !== "undefined" ? window : this, function ($, root, undefined) {
    'use strict';
    if (!$) {
        $ = root.jQuery || null;
    }
    if (!$) {
        throw new TypeError("必须引入jquery库才能正常使用！");
    }

    var arraySlice = Array.prototype.slice,
        comparison = function (obj1, obj2) {
            var result = true;
            for (var pro in obj1) {
                if (obj1[pro] !== obj2[obj1]) {
                    result = true;
                    break;
                }
            }
            return result;
        }

    function MLoading(dom, options) {
        options = options || {};
        this.dom = dom;
        this.options = $.extend(true, {}, MLoading.defaultOptions, options);
        this.curtain = null;
        this.render().show();
        console.log(dom)
    }
    MLoading.prototype = {
        constructor: MLoading,
        initElement: function () {
            var dom = this.dom,
                ops = this.options;
            var curtainElement = dom.children(".dg-maskBox"),
                bodyElement = curtainElement.children('.dg-maskBg'),
                contentElement = curtainElement.children('.dg-maskContent'),
                titleElement = contentElement.children('.dg-maskTitle'),
                areatextElement = contentElement.children('.dg-text'),
                groupElement = contentElement.children('.dg-group'),
                buttonElement = groupElement.children('dg-buttom')

            if (curtainElement.length == 0) {
                curtainElement = $('<div class="dg-mask"></div>');
                dom.append(curtainElement);
            }

            if (bodyElement.length == 0) {
                bodyElement = $('<div class="dg-maskBg"></div>');
                curtainElement.append(bodyElement);
            }

            if (contentElement.length == 0) {
                contentElement = $('<div class="dg-maskContent"></div>');
                curtainElement.append(contentElement);
            }

            if (titleElement.length == 0) {
                titleElement = $('<div class="dg-maskTitle"></div>');
                contentElement.append(titleElement);
            }

            if (areatextElement.length == 0) {
                areatextElement = $('<div class="dg-text"></div>');
                contentElement.append(areatextElement)
            }

            if (groupElement.length == 0) {
                groupElement = $('<div class="dg-group"></div>');
                contentElement.append(groupElement)
            }

            if (buttonElement.length == 0) {
                buttonElement = $('<div class="dg-button"></div>');
            }

            this.curtainElement = curtainElement
            this.bodyElement = bodyElement
            this.contentElement = contentElement
            this.titleElement = titleElement
            this.areatextElement = areatextElement
            this.groupElement = groupElement
            this.buttonElement = buttonElement

            console.log(this)

            return this;
        },
        render: function () {
            var dom = this.dom,
                ops = this.options;
            this.initElement();

            if (ops.mask) {
                this.curtainElement.addClass("dg-showmask");
                setTimeout(function(){
                    $('.dg-maskContent').animate({top:'50%'},ops.animate)
                },10)
            } else {
                this.curtainElement.removeClass("dg-showmask");
            }
            this.titleElement.text(ops.title);
            this.areatextElement.html(ops.text)
            this.areatextElement.css('text-align',ops.align)
            if (ops.handler && ops.handler instanceof Array) {
                var handlerHtml = ''
                for (var i = 0; i < ops.handler.length; i++) {
                    handlerHtml += '<div class="dg-button">' + ops.handler[i] + '</div>'
                    this.groupElement.html(handlerHtml)
                    if (ops.handler.length == 1) {
                        $('.dg-button').addClass('eventStyle')
                    } else {
                        $('.dg-button').eq(1).addClass('eventStyle')
                    }
                    $('.dg-button').click(function () {
                        ops.callback($(this).text())
                    })
                }
            } else {
                console.error('handler选项请传入数组')
            }


            return this;
        },
        setOptions: function (options) {
            options = options || {};
            var oldOptions = this.options;
            this.options = $.extend(true, {}, this.options, options);
            if (!comparison(oldOptions, this.options)) this.render();
        },
        show: function () {
            var dom = this.dom,
                ops = this.options;
            return this;
        },
        hide: function () {
            // 防止在加载页面滑动
            document.documentElement.scrollTop = 0

            this.curtainElement.removeClass("active");
            if (!dom.is("html") && !dom.is("body")) {
                dom.removeClass("mloading-container");
            }

            return this;

        },
        destroy: function () {

        }
    };
    MLoading.dataKey = "MLoading";
    MLoading.defaultOptions = {
        mask: true,  //是否显示遮罩层
        title: "默认标题",
        text: "默认文本",
        align: 'left',
        handler: ['我知道了'],
        animate: 150
    };

    $.fn.mask = function (options) {
        var ops = {},
            funName = "",
            funArgs = [];
        if (typeof options === "object") {
            ops = options;
        } else if (typeof options === "string") {
            funName = options;
            funArgs = arraySlice.call(arguments).splice(0, 1);
        }
        return this.each(function (i, element) {
            var dom = $(element),
                plsInc = dom.data(MLoading.dataKey);

            if (!plsInc) {
                plsInc = new MLoading(dom, ops);
            }

            if (funName) {
                var fun = plsInc[funName];
                if (typeof fun === "function") {
                    fun.apply(plsInc, funArgs);
                }
            }
        });
    }
    $.fn.close = function (options) {
        this.each(function (i, element) {
            if ($(element).is('body') || $(element).is('html')) {
                $('.dg-mask').remove()
            }
        })


    }
}));