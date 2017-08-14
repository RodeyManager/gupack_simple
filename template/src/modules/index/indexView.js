'use strict';

const
    App = require('../../config/app-config'),
    AppService = require('../../services/app.servvice').getInstance({}),
    links = require('../../components/links/script');

$(function(){
    console.log($(document));

    links();

    // APPModel.test 方法对应api的test
    // 参考config/app-api.js的App.webServiceUrls
    AppService.test(res => {
        console.log(res);
    });
    AppService.test().done(res => {
        console.log(res);
    });
    AppService.test.get().done(res => {
        console.log(res);
    });
    AppService.test.post().done(res => {
        console.log(res);
    });
    AppService.doRequest(App.getWebServiceUrl('test'), res => {
        console.log(res);
    });
    AppService.doRequest(App.getWebServiceUrl('test'), { name: 'Gupack' }, res => {
        console.log(res);
    });

});

