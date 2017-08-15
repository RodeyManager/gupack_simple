'use strict';

const
	AppService = require('./app.service');

export default class TestService{
	constructor(){}

	getTestData(){
		return AppService.test().then(res => {
		    res.__proto__.toJSON = (res) => res;
		    res.__proto__.toData = () => res.data;
		    return res.data;
        }).catch(this.error.bind(this));
	}

	error(err){
	    console.log('request error: ', err);
    }
}