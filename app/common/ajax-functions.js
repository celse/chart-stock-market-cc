'use struct';

var appUrl =window.location.origin;

var ajaxFunctions = {
	ready : function ready(fn) {
		if (typeof fn !== 'function') {
			return;
		}
		if (document.readyState === 'complete') {
			return fn();
		}
		document.addEventListener('DOMContentLoaded', fn, false);
	},
	ajaxRequest : function ajaxRequest (method, url, callback){
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status === 200) {
				callback(xmlhttp.response);
			}else{
				console.log('status : '+xmlhttp.status);
				console.log('readyState : '+xmlhttp.readyState);
			}
		}

		xmlhttp.open(method, url, true);
		xmlhttp.send();
	}
};

function creatLenge(parent, array_title){
	
	for(var i=0 ; i < Object.keys(array_title).length; i++){
		var divCol = document.createElement("div"),
			divpanel = document.createElement("div"),
			divpanelHead = document.createElement("div"),
			h3Title = document.createElement("h3"),
			divpanelBody = document.createElement("div");
			

		divCol.setAttribute('class','col-xs-6 col-sm-3');
		divpanel.setAttribute('class','panel panel-info');
		divpanelHead.setAttribute('class','panel-heading');
		h3Title.setAttribute('class','panel-title');
		divpanelBody.setAttribute('class','panel-body');

		var txt_tl = document.createTextNode(Object.keys(array_title)[i]);
		var tmp_text = array_title[Object.keys(array_title)[i]]+'. Prices, Dividends, Splits and Trading Volume';
		var txt_leng = (tmp_text.length <= 52) ? document.createTextNode(tmp_text) : document.createTextNode(tmp_text.slice(0,52)+'...');

			

		h3Title.appendChild(txt_tl);
		divpanelHead.appendChild(h3Title);
		divpanel.appendChild(divpanelHead);

		divpanelBody.appendChild(txt_leng);
		divpanel.appendChild(divpanelBody);

		divCol.appendChild(divpanel);

		parent.appendChild(divCol);
	}
		
};
function alertmsg(parent, text){
	var div = document.createElement("div"),
		span1 = document.createElement("span"),
		span2 = document.createElement("span"),
		txt_t1 = document.createTextNode(text),
		txt_t2 = document.createTextNode('Error:');
	div.setAttribute('class',"alert alert-danger");
	div.setAttribute('role',"alert");
	div.setAttribute('id',"alert-erro");	
	span1.setAttribute('class',"glyphicon glyphicon-exclamation-sign");
	span1.setAttribute('aria-hidden',"true");
	span2.setAttribute('class',"sr-only");

	span2.appendChild(txt_t2)
	

	div.appendChild(span1);
	div.appendChild(span2);
	div.appendChild(txt_t1);
	parent.appendChild(div);

};
