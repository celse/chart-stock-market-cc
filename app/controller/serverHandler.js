require('dotenv').load();
var path= process.cwd();
const AvAPI = require('alphavantage-api');
var yahooFinance = require('yahoo-finance');

var fs = require('fs'),readline = require('readline'),lineReader = require('line-reader');;

function EventHander(){
	var dataIncator={},testStatus= false;
	var indicsList = ['goog','aapl','amzn'],
		interValIndice=[[0,813],[814, 1626],[1627, 2439],[2440, 3249]],
		viewData ={}
	    bkpList ={},lastRefresh='';

	
	function dateToString(firstDate){
		var monthget = firstDate.getMonth() + 1
		var dateMonth = ((monthget >= 10) ? monthget : '0'+monthget) ;
		var dateDay = ((firstDate.getDate() >= 10) ? firstDate.getDate() : '0'+firstDate.getDate()) ;
		var	dateTostring = firstDate.getFullYear()+'-'+dateMonth+'-'+dateDay;
		return dateTostring;
	}
	
	function loadDataFromAPI(indice, res){
		var lastRefresh_tmp ='';
		var option = {}
		var firstDate = dateToString(new Date());
		if(typeof(indice) =="string"){
			option = {
				symbol: indice,
				from: '2015-01-01',
				to: firstDate,
			}
		}else{
			viewData = {};
			option = {
				symbols: indice,
				from: '2015-01-01',
				to: firstDate,
			}
		}
		
		yahooFinance.historical(option, function (err, quotes) {
				if(err) {
					throw err;	
				}
				var data = quotes
				
				//viewData = {};
				if(typeof(indice) =="string"){
					if (data.length != 0) {
						descript = dataIncator[indice.toUpperCase()];
						
						var myquote = {}
						for (var j = 0 ; j < data.length; j++){
							var d = data[j].date;
							var newDate = dateToString(d)
							myquote[newDate]=data[j].open;
						}
						if(data.length == Object.keys(myquote).length){
							viewData[indice]={'symbol': descript,quote:myquote}
							res.json({data:viewData, indic:indice});	
						}
						
					}else{
						res.json({'error':'Indicatore '+indice+' data note not found'});
					}
				}else{
					for (var i = 0 ; i < Object.keys(data).length; i++){
						var listkey = Object.keys(data)[i]
						if(data[listkey].length != 0){
							descript = dataIncator[listkey.toUpperCase()];
							viewData[listkey]={'symbol': descript,quote:{}};
							for (var j = 0 ; j < data[Object.keys(data)[i]].length; j++){
								var d = data[Object.keys(data)[i]][j].date;
								var newDate = dateToString(d)
								viewData[listkey].quote[newDate]=data[Object.keys(data)[i]][j].open;
							} 
						}
							
					}
					
					lastRefresh = new Date();
					if (res) {
						res.json(viewData);	
					}
					
				}
				
		});

	};
	function autoIndic(){
		indicsList=[];
		for (var i = 0 ; i < 4; i++){
			indicsList.push(Object.keys(dataIncator)[intervalRandom(interValIndice[i][0],interValIndice[i][1])])
				
		}
	}
	
	
	Array.prototype.diff = function(a) {
    	return this.filter(function(i) {return a.indexOf(i) < 0;});
	};
	

	
	
	function intervalRandom(min,max)
	{
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	function readerline(){
		lineReader.eachLine(path+'/app/common/indicator.txt', function(line, last) {
			
			dataIncator[line.split(",")[0]] = line.split(",")[1];
			list = line.split(",")
			if(last){
				autoIndic();
				loadDataFromAPI(indicsList)
			}
		});

	}
	function stockReloadFor1H(res){
		if(lastRefresh != ''){
			lastCallAPI = new Date(lastRefresh);
			var myH = lastRefresh.getHours();
			var myMn = lastRefresh.getMinutes() + 30;
			nextCallAPI = lastCallAPI.setHours(myH, myMn, 0, 0);
			//console.log('neste TEXT : '+new Date(nextCallAPI));
			var Today = Date.now(); 
			if(nextCallAPI < Today){
				autoIndic();
				loadDataFromAPI(indicsList,res);
				//res.json(viewData);
			}else{
				res.json(viewData);
			}
		}	
	}
	readerline();
	
	this.loadPage = function(req, res){
		stockReloadFor1H(res)
	};

	this.searchstock= function(req, res){
		var stockIndice = req.params.id;
		if(Object.keys(dataIncator).includes(stockIndice.toUpperCase())){
			loadDataFromAPI(stockIndice.toUpperCase(), res);
		}else{
			res.json({'error':'Indicatore : '+stockIndice.toUpperCase()+' not found try an other.'})
		}
	}
	
}
module.exports = EventHander;