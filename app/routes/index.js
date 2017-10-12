'use strict';
var path = process.cwd();
console.log(path)
var LoadHander = require(path + '/app/controller/serverHandler.js')

module.exports = function (app) {
    var loadHander = new LoadHander();

    /*
	app.route('/')
		.get(function (req, res) {
		    
		    //clickHander.load_api();
		    res.sendFile(path + '/public/home.html');
		});

    */
    app.route('/')
    	.get((req, res)=>{
    		res.sendFile(path + '/public/index.html');
    	});

    app.route('/api')
        .get((req, res)=>{
            loadHander.loadPage(req, res);
        });
    app.route('/api/:id')
        .get((req, res)=>{
            loadHander.searchstock(req, res);
        });



}