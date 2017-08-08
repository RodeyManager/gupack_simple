/**
 * Created by Rodey on 2015/7/20.
 * 数据管理
 */

// APPModel (Ajax)
;(function(){
    'use strict';
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

    class APPModel{

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
                this._ajax.apply(this, APPModel._merageArgs(url, arguments));
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
            options.fail = fail;
            options.data = data;
            options.url = url;

            this.ajaxSetting = $.extend(true, {}, defaultConfig, this.config, options);
            // 发送ajax请求前触发
            let beforeSend = this.ajaxSetting['beforeSend'];
            let befor = beforeSend.apply(null);
            if(befor === false) return false;

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

    }

    this['APPModel'] = new APPModel();

}).call(this || window);

