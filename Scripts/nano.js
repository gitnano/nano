/*!
 * JJJJavaScript
 * 2015/10/01~2015/11/02
 * By Nano
*/

(function (windows) {
    var isFoot_Timer = null;
    var a_htmlbody=$('html, body');
    //强转JSON
    toJson = function (text) {
        var json;
        try {
            if (typeof JSON === 'object' && typeof JSON.parse === 'function') {
                json = JSON.parse(text);
            } else {
                json = eval(text);
            }
        } catch (e) { }
        return json;
    }


    //交换obj1与obj2成员名相同的值
    extend = function (obj1, obj2) {
        for (var name in obj2) {
            obj1[name] = obj2[name];
        }
        return obj1;
    }


    //跳转链接
    href = function (text) {
        window.location.href = window.location.href.substring(0, window.location.href.indexOf("/")) + (text)
    }


    //超过一定字数，将其打断
    sub = function (text, max) {
        var s = '';
        if (text.replace(/[^\x00-\xff]/g, "01").length <= max) {
            return text;
        } else {
            var count = 0;
            for (var i = 0; count < max - 1; i++) {
                if (/[^\x00-\xff]/.test(text[i])) {
                    count += 2;
                    s += text[i];
                } else {
                    count++;
                    s += text[i];
                }
            }
            s += '...';
            return s;
        }

    }


    //滑动到底部执行方法，需要监听onscroll事件
    isFoot = function (callback) {
        if (typeof callback == 'function') {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
            var viewH = document.documentElement.clientHeight || document.body.clientHeight;//可见高度
            var contentH = document.documentElement.scrollHeight || document.body.scrollHeight;//内容高度
            if (contentH < scrollTop + viewH + 9) {
                if (isFoot_Timer) { clearTimeout(isFoot_Timer); }
                isFoot_Timer = setTimeout(function () { callback(); }, 400);
            }
        }
    }


    //返回顶部
    backTop = function () {
        timer = setInterval(function () {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
            document.documentElement.scrollTop = document.body.scrollTop = scrollTop - scrollTop / 3;
            if (scrollTop == 0) { clearInterval(timer) }
        }, 30);

    }

    //获取手机验证码倒计时
    codeCountdown = function (input, mobile) {
        $(input).attr("disabled", "disabled");
        if ($("#" + mobile).val() == "") {
            $(input).attr("disabled", false);
            $("#" + mobile).focus();
            return;
        }

        $.ajax({
            type: "post",
            url: "/Account/SendVerificationCode",
            data: { mobile: $("#" + mobile).val() },
            dataType: "text",
            success: function (data) {
                if (data == "1") {
                    var seconds = 120;
                    var t = setInterval(function () {
                        $(input).val(seconds + "秒后重新发送");
                        seconds--;
                        if (seconds < 0) {
                            $(input).val("获取手机验证码");
                            $(input).attr("disabled", false);
                            clearInterval(t);
                        }
                    }, 1000);
                } else {
                    alert("手机验证码发送失败,请稍后重试");
                }
            }
        });
    }

    //上传图片 multiple 
    upimg = function (inputId, resultId) {
        var input = document.getElementById(inputId);
        var result = document.getElementById(resultId);
        if (typeof FileReader === 'undefined') {
            result.innerHTML = "抱歉，你的浏览器不支持 FileReader";
            input.setAttribute('disabled', 'disabled');
        } else {
            input.addEventListener('change', readFile, false);
        }
        function readFile() {
            result.innerHTML = "";
            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];
                if (!/image\/\w+/.test(file.type)) {
                    alert("请确保文件为图像类型");
                    return false;
                }
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    result.innerHTML = result.innerHTML + '<img src="' + this.result + '" alt=""/>'
                }
            }
        }
    }
    setImagePreview=function(a, b, c) {
        // var docObj = document.getElementById("doc");
        var docObj = document.getElementById(a);
        //var imgObjPreview=document.getElementById("preview");
        var imgObjPreview = document.getElementById(b);
        if (docObj.files && docObj.files[0]) {
            //火狐下，直接设img属性
            imgObjPreview.style.display = 'block';
            imgObjPreview.style.width = '100px';
            imgObjPreview.style.height = '100px';
            //imgObjPreview.src = docObj.files[0].getAsDataURL();

            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
            imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
        } else {
            //IE下，使用滤镜
            docObj.select();
            var imgSrc = document.selection.createRange().text;
            //var localImagId = document.getElementById("localImag");
            var localImagId = document.getElementById(c);
            //必须设置初始大小
            localImagId.style.width = "100px";
            localImagId.style.height = "100px";
            //图片异常的捕捉，防止用户修改后缀来伪造图片
            try {
                localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
            } catch (e) {
                alert("您上传的图片格式不正确，请重新选择!");
                return false;
            }
            imgObjPreview.style.display = 'none';
            document.selection.empty();
        }
        return true;
    }

    //切换面板 active
    switchShow = function (nav, div, type) {
        $(nav).click(function () {
            $(nav + '.' + type).removeClass(type)
            $(this).addClass(type)
            $(div).hide()
            $(div).eq($(this).index()).show()
        })
    }
    switchShowHover = function (nav, div) {
        $(nav).hover(function () {
            $(nav + '.active').removeClass('active')
            $(this).addClass('active')
            $(div).hide()
            $(div).eq($(this).index()).show()
        })
    }

    //console.log
    log=function () {
        var message = Array.prototype.slice.call(arguments, 0);
        console.log.apply(console, ['[N]'].concat(message));
        //message.unshift('(app)');
        //console.log.apply(console, message);
    }

    //<a>平滑跳转锚点
    aa = function () {
        $('a').click(function () {
            var href = $.attr(this, 'href');
            a_htmlbody.animate({
                scrollTop: $(href).offset().top
            }, 500, function () {
                window.location.hash = href;
            });
            return false;
        });
    }





  



    SomeBody = function () {

        $().click(function (e) {
            /*target发起事件者 currentTarget监听事件者*/
            if (e.target == e.currentTarget)
                sb();
        });


    }

    //var hentai = [
    //               { 'name': '彼女と彼女の猫', 'digit': 7 },
    //               { 'name': '咕噜', 'digit': 25 },
    //               { 'name': '空之轨迹', 'digit': 25 },
    //               { 'name': '三十五亿分之一的肥现充', 'digit': 9 },
    //               { 'name': 'cdxjcl123', 'digit': 9 },
    //               { 'name': '瞎说大实话', 'digit': 9 },
    //               { 'name': '萌二观察者', 'digit': 20 },
    //               { 'name': '十六分之一的帅哥Edward', 'digit': 1 },
    //               { 'name': '( ・_ゝ・)', 'digit': 7 },
    //               { 'name': '丧尸穴斯基', 'digit': 1990 },
    //               { 'name': '青蛙君', 'digit': 52 },
    //               { 'name': 'Ruri', 'digit': 13 },
    //               { 'name': '（・∀・）', 'digit': 48 },
    //               { 'name': 'Nightmare', 'digit': 16 },
    //               { 'name': 'NT.Frankval', 'digit': 27 },
    //               { 'name': 'rookieII', 'digit': 6 },
    //               { 'name': '、', 'digit': 50 },
    //               { 'name': '灶', 'digit': 0 },
    //               { 'name': '!', 'digit': 36 },
    //               { 'name': '⑦', 'digit': 7 },  
    //               { 'name': '十ハ歳の腐敗少年', 'digit': 1 },
    //               { 'name': 'float', 'digit': 4 },
    //               { 'name': 'Polaris.', 'digit': 9 },
    //               { 'name': 'tinn', 'digit': 7 },
    //               { 'name': 'NC', 'digit': 31415926535 },
    //               { 'name': '阪本33', 'digit': 33 },
    //               { 'name': '遺世獨立的萌貮', 'digit': 9 },
    //             ]
    //var total = 0
    //for (var i = 0; i < hentai.length; i++) {
    //    total += hentai[i].digit
    //}
    //var index = total % hentai.length
    //console.log('总数:' + total)
    //console.log('人数:' + hentai.length)
    //console.log('余数:' + index)
    //console.log('so!恭喜,' + hentai[index].name)

    //window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) { alert('JavaScript出现错误！\r错误信息:'+ errorMessage+'\r错误地址:'+ scriptURI+'  '+lineNumber+'行'); return true }

})(window)

