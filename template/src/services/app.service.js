
const App = require('../config/app-config');

const toString = Object.prototype.toString;
const emptyFun = () =>{};
let defaultConfig = {
    type: 'GET',
    method: 'GET',
    dataType: 'json',
    cache: false,
    timeout: 0,
    contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
    success: emptyFun,
    error: emptyFun,
    complete: emptyFun,
    beforeSend: emptyFun
};

let instance = null;

class AppService{

    constructor(config){
        this.config = config || {};
        this._init();
    }

    _init(){
        let apis = App.webServiceUrls;
        if(apis && '[object Object]' === toString.call(apis)){
            for(let key in apis){
                if(apis.hasOwnProperty(key)){
                    let url = App.getWebServiceUrl(key);
                    this[key] = this._injectObject(url, this._inject(url));
                }
            }
        }
    }

    _injectObject(url, obj){
        let self = this;
        ['get', 'post'].map(method => {
            obj[method] = function(m){
                let args = [].slice.call(arguments);
                let data = args[0] || {},
                    su = args[1] || function(){},
                    dataType = args[2] || 'json';
                return $[method].call(self, url, data, su, dataType);
            }
        });
        return obj;
    }

    _inject(url){
        return function(){
            return this._ajax.apply(this, AppService._merageArgs(url, arguments));
        }
    }

    /**
     *  AJAX统一调用方法
     * @param url       请求地址
     * @param data      请求数据
     * @param su        成功回调
     * @param fail      失败回调
     * @param options   可选项
     * @private
     */
    _ajax(url, data, su, fail, options){
        if(!url){
            throw new SyntaxError('not found ajax url');
        }
        // .test(function(res){}, function(err){}, options);
        if($.isFunction(data) && $.isFunction(su)){
            su = data;
            fail = su;
            options = fail;
            data = undefined;
        }
        // .test(function(res){}, options);
        if($.isFunction(data) && (!su || '[object Object]' === toString.call(su) )){
            options = su;
            su = data;
            data = undefined;
        }
        if('object' === $.type(fail)){
            options = fail; fail = emptyFun;
        }
        options = options || {};
        options.success = su;
        options.error = fail;
        options.data = data;
        options.url = url;

        this.ajaxSetting = $.extend(true, {}, defaultConfig, this.config, options);
        // 发送ajax请求前触发
        let beforeSend = this.ajaxSetting['beforeSend'];
        let before = beforeSend.apply(null);
        if(before === false) return false;

        return $.ajax(this.ajaxSetting);
    }

    static _merageArgs(url, args){
        args = [].slice.call(args);
        args.unshift(url);
        return args;
    }

    doRequest(){
        return this._ajax.apply(this, arguments);
    }

    static getInstance(config){
        if(!instance || !(instance instanceof AppService)){
            instance = new AppService(config);
        }
        return instance;
    }

}

export default AppService.getInstance();