;(function() {
    'use strict';

    let App = {
        // 接口host
        ServerHost: 'http://192.168.1.100:8080/app/', //(xxx)
        method: 'POST',
        sendTime: 60,
        debug: true
    };

    this['App'] = App;
    return App;

}).call(this || window);
