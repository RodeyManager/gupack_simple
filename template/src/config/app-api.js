/**
 * Created by Rodey on 2017/6/9.
 * 应用接口
 */
;(function() {
    'use strict';

    // API
    App.webServiceUrls = {
        test                : 'test'

    };

    // 根据key获取api地址
    let protocolReg = /^(https?:)?\/\//i;
    App.getWebServiceUrl = (name, host) => {
        const APINAME = App.webServiceUrls[name];
        return protocolReg.test(APINAME) ? APINAME : App.getHosts((host || App.ServerHost) + APINAME + (App.apiSuffix || ''));
    };
    App.getHosts = (page) => {
        if(protocolReg.test(page) || /^\.+\//.test(page))  return page;
        return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/' + page;
    };

}).call(this || window);
