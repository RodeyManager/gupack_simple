/**
 * Created by Rodey on 2017/7/28.
 */

;(function(){
    'use strict';

    $(function(){
        console.log($(document));
        // APPModel.test 方法对应api的test
        // 参考config/app-api.js的App.webServiceUrls
        APPModel.test(res => {
            console.log(res);
        });
        APPModel.test().done(res => {
            console.log(res);
        });
        APPModel.test.get().done(res => {
            console.log(res);
        });
        APPModel.test.post().done(res => {
            console.log(res);
        });
        APPModel.doRequest(App.getWebServiceUrl('test'), res => {
            console.log(res);
        });
        APPModel.doRequest(App.getWebServiceUrl('test'), { name: 'Gupack' }, res => {
            console.log(res);
        });

    });

}).call(this || window);