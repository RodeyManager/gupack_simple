;(function(){
    'use strict';

    $(function(){
        /*------------页面公共事件处理----------------*/

        // 输入长度限制
        $('body').delegate('input[maxlength]', 'keyup', function(){
            let maxLen = $(this).attr('maxlength'),
                value = $(this).val();
            if(maxLen && value.length > maxLen){
                $(this).val(value);
                return false;
            }
        });
        // 转大写
        $('.to-upper').keyup(function(){
            let val = $(this).val() || '';
            $(this).val(val.toUpperCase());
        });
        // 只能是数字
        $('.input-num').keyup(function(){
            let val = ($(this).val() || '').replace(/[^\d\.]*/g, '');
            $(this).val(val);
        });

    });

}).call(this || window);
