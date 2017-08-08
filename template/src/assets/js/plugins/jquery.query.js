/**
 * author: rodey
 * 获取get模式下url中的指定参数值
 * @param name      参数名
 * @param url       传入的url地址
 * @returns {*}
 */
;(function(jQuery){
    function queryString(name, url, qsIndex){
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
            index = qsIndex || 1,
            search = '';
        if(url && 'string' === typeof url && url.length > 0){
            url = decodeURIComponent(url);
            search = (url.split('?')[index] || '').match(reg);
        }else{
            search = window.location.search.substr(index).match(reg);
        }
        return search ? decodeURIComponent(search[2]) : null;
    }

    function queryStrings(url){
        var search = (url || location.href).split('?')[1], ps = {};
        if(search){
            search.replace(/([^=&]+?)(=([^&]*?))?(&|$)/g, function(m, key, $2, val){
                ps[key] = 'undefined' !== typeof(val) ? decodeURIComponent(val) : null;
            });
        }
        return ps;
    }

    if(jQuery){
        jQuery.extend({
            'queryString': queryString,
            'queryStrings': queryStrings
        });
    }else{
        window['queryString'] = queryString;
        window['queryStrings'] = queryStrings;
    }

})(jQuery);