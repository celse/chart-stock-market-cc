'use strict';

(function(){

var chartdiv = document.getElementById('chartdiv') || null;
var setlegend = document.getElementById('set-legend') || null;
var spanBtn = document.getElementById('input-btn') || null;
var inputSet =document.getElementById("inputSet") || null;
var panelbody =document.getElementById("panelbody") || null;
var error =document.getElementById("error") || null;
 

var listDataKey =[];
var chartData = {};
var stockData = {};
//error.hide();
function setStockChart(data, indicatore){
		


	listDataKey = Object.keys(data);
	
	for(var i = 0;  i < listDataKey.length; i++){
		chartData[listDataKey[i]]=[]
		stockData[listDataKey[i]]=data[listDataKey[i]].symbol;
	};
	var setDateSet = [];
	generateChartData(listDataKey, data);
	
	for(var i = 0;  i < listDataKey.length; i++){
		
		if(i == 0){
			setDateSet.push({
				title: listDataKey[i],
				fieldMappings: [{
					fromField: "value",
					toField: "value"
				}, {
					fromField: "volume",
					toField: "volume"
				}],
				dataProvider: chartData[listDataKey[i]],
				categoryField: "date"
			})
		}else{
			setDateSet.push({
				title: listDataKey[i],
				compared:true,
				fieldMappings: [{
					fromField: "value",
					toField: "value"
				}, {
					fromField: "volume",
					toField: "volume"
				}],
				dataProvider: chartData[listDataKey[i]],
				categoryField: "date"
			})
		}
	};
	
	var setMakeChart = {
		type: "stock",
		dataSets: setDateSet,

		panels: [{
			color : "#FFFFFF",
			showCategoryAxis: true,
			title: "STOCK",
			percentHeight: 10,

			stockGraphs: [{
				id: "g1",

				valueField: "value",
				comparable: true,
				compareField: "value",
				bullet: "round",
				bulletBorderColor: "#FFFFF",
				bulletBorderAlpha: 1,
				balloonText: "[[title]]:<b>[[value]]</b>",
				compareGraphBalloonText: "[[title]]:<b>[[value]]</b>",
				compareGraphBullet: "round",
				compareGraphBulletBorderColor: "#FFFFF",
				compareGraphBulletBorderAlpha: 1
			}],
			stockLegend: {
			periodValueTextComparing: "[[percents.value.close]]%",
			periodValueTextRegular: "[[value.close]]",
			color : "#FFFFFF",		
		},
			
		}
		],


		chartScrollbarSettings: {
			graph: "g1",
            ///////
            //graphLineColor : "#FFFFFF",
            //graphFillColor : "#FFFFFF",
            selectedGraphLineColor : "red",
			updateOnReleaseOnly:true,
            position: "bottom",
           
		},
		chartCursorSettings: {
			valueBalloonsEnabled: true,
			valueLineEnabled:false,
			valueLineBalloonEnabled:true
		},

		periodSelector: {
			position: "top",
			color : "blue",
			periods: [{
				period: "MM",
				selected: true,
				count: 1,
				label: "1m"
			},{
				period: "MM",
				selected: true,
				count: 3,
				label: "3m"
			},{
				period: "MM",
				selected: true,
				count: 6,
				label: "6m"
			}, { period: "YTD",
				label: "YTD"
			}, {
				period: "YYYY",
				count: 1,
				label: "1Y"
			},{
				period: "MAX",
				label: "All"
			}]
		},
		valueAxesSettings: {
            gridColor : "#FFFFFF",
        },
		
	};
	//Set Legende
	/*
	amChartsInputField amcharts-start-date-input

	.amChartsButton
	.amChartsButtonSelected

	*/

	AmCharts.makeChart("chartdiv",setMakeChart)
	//AmCharts.theme = AmCharts.themes.light;
	if(setlegend != null && Object.keys(stockData).length != 0){
		//creat legend Html
		if (indicatore) {
			//console.log(indic);
			var tmp={}
			tmp[indicatore]=stockData[indicatore];
			creatLenge(setlegend, tmp);
		}else{
			creatLenge(setlegend, stockData);	
		}
		
	}
}
if(chartdiv != null){
	var init_url = appUrl + '/api';
	ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', init_url, loadpage));
};
if(spanBtn != null){
	spanBtn.addEventListener('click',function(){
		if(document.getElementById("alert-erro")){
			document.getElementById("alert-erro").style.display = "none";
		}

		if (inputSet != null) {
			if( inputSet.value != "" && inputSet.value != undefined ){
				var url = appUrl + '/api/'+inputSet.value;
				ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', url, stockQuery));

			}else{
				inputSet.focus();
			}
		}
			
	});
}
// waitinf for 5s
function stateChange(data) {
    setTimeout(function () {
        if (data) {
            if(document.getElementById("loading")){
            	document.getElementById("loading").setAttribute('class','stop');
				document.getElementById("loading").style.display = "none";
			}
            var myjson = JSON.parse(data);
			setStockChart(myjson);
			document.getElementById("stochBlock").style.display = "block";
        }
    }, 3000);
}

//Load data 
function loadpage(data){
	//console.log(data);
	//(data)? console.log('O va benbe '):console.log('NON NON ');
	stateChange(data);
	
	
}
function stockQuery(data){
	var myjson = JSON.parse(data);
	//console.log('TEST WAITING');
	
	
	if(Object.keys(myjson).includes('error')){

		alertmsg(panelbody,myjson['error'])
	}else{
		setStockChart(myjson.data, myjson.indic);
	}
}
//setdata for the stockchart
function generateChartData(list, data_array) {
	var firstDate = new Date();
	firstDate.setDate(firstDate.getDate() - 500);
	firstDate.setHours(0, 0, 0, 0);
	
	for (var i = 0; i < 500; i++) {
		var newDate = new Date(firstDate);
		newDate.setDate(newDate.getDate() + i);
		var monthget = newDate.getMonth() + 1
		var dateMonth = ((monthget >= 10) ? monthget : '0'+monthget) ;
		var dateDay = ((newDate.getDate() >= 10) ? newDate.getDate() : '0'+newDate.getDate()) ;
		var	dateTostring = newDate.getFullYear()+'-'+dateMonth+'-'+dateDay;
		
		
		for(var k = 0;  k < listDataKey.length; k++){
			var value_symbole = 0
			if(Object.keys(data_array[listDataKey[k]].quote).includes(dateTostring)){
				
				chartData[listDataKey[k]].push({
					date: newDate,
					value: data_array[listDataKey[k]].quote[dateTostring],
				});
			}
		};
	}
	//console.log(chartData);
}

})();