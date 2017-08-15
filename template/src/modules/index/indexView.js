'use strict';

const
    App = require('../../config/app-config'),
    AppService = require('../../services/app.service').getInstance({}),
    TestService = require('../../services/test.service'),
    links = require('../../components/links/script');


    console.log(document.body);

    links();

    let testService = new TestService();

    testService.getTestData().then(data => {
        console.log('res.data: ', data);
    });

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



