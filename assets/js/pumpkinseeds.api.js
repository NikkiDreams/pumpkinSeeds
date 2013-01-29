/* Pumpkin Seeds Global APIs
 * This Class is used to setup and initialize the core components
 * @author Nichole Shannon
 */

/* Add Class to pks Namespace */
pks.namespace('api');


pks.api = {
	init: function () {
		pks.api.controller.setConstants();

		if (pks.core.model.isClassReady) {
			pks.api.controller.events.classIsReady();
		}
		else {
			$(document).bind("pks.core:isReady", function () {
				pks.api.controller.events.classIsReady();
			});
		}

	},
	constants: {
		requestParameters: {},
		en_us:{}
	},
	model: {
		isClassReady: false,
		isModelReady: false,
		jsonResponse: null,
		isFormValid: false
	},
	controller: {
		setConstants: function () {
				var constants = pks.api.constants;
		},
		events: {
			classIsReady: function () {
				$(document).trigger("pks.api:isReady");
				pks.api.model.isClassReady = true;
				pks.core.api.logger("Event: pks.api:isReady");
			}
		}
	},
	validation: null,
	/** All public interface functions  */

	/**
	* Get any query parameters and append the REST URL string with these params
	* */
	getQueryParameters: function () {
		var constants = pks.core.config.constants.requestParameters;
		var formatedParamters = null;
		var queryParameters = [];
		var userParameters = null;


		return formatedParamters;
	},
	/**
	* This method constructs the URL used to request a REST service
	* */
	getPksCoreURL: function () {
		var PUMPKINSEEDS_REST_URL = pks.core.config.constants.PUMPKINSEEDS_REST_URL;
		var constants = pks.core.constants.requestParameters;
		var foo;

		var requestHost = window.location.host;
		var requestProtocol = "http:";
		if (window.location.protocol == "http:") {
			requestProtocol = "http:";
		} else {
			requestProtocol = "https:";
		}

		var pksCoreURL = requestProtocol + "//" + requestHost + PUMPKINSEEDS_REST_URL + "/" + foo  ;
		var formatedParamters = pks.api.getQueryParameters();
		if (formatedParamters !== null) {
			pksCoreURL = pksCoreURL + "?" + formatedParamters;
		}

		return pksCoreURL;
	},
	/* Sample API Call to destroy and rewrite the initial API Core JSON Sample */
	prependApiDataObject:function(data, obj){
		//TODO: JS Templatize this using JSViews or Handlebars
		var content = '<section class="container" id="pks_core_JSON_sample"><div class="row-fluid"><div class="content span10">'
			+ '<h2>PKS Core JSON Response</h2>'
			+ '<label>API Name: ' + data.API + '</label>'
			+ '<label>API Version: ' + data.version + '</label>'
			+ '<h5>Sample Data: '+ pks.core.config.constants.PUMPKINSEEDS_JSON_DATA +'</h5>'
			+ '<label>data.geolocation.country.USA.states:<br/><pre>' + JSON.stringify(data.geolocation.country.USA.states) + '</pre></label>'
			+ '<label>data.user.identity:<br/><pre>' + JSON.stringify(data.user.identity) + '</pre></label>'
			+ '<label>data.user.orientation:<br/><pre>' + JSON.stringify(data.user.orientation) + '</pre></label>'
			+ '<label>data.user.status:<br/><pre>' + JSON.stringify(data.user.status) + '</pre></label>'
			+'</div></div></section>';

		if( document.getElementById("pks_core_JSON_sample") ){
			$("#pks_core_JSON_sample").fadeOut("slow", function(){
				$(this).remove();
				$(obj).before(content);
			});
		}
		else{
			$(obj).before(content);
		}

		pks.core.api.logger("API: pks.prependApiDataObject");
	}

};

// convert form data to JSON
$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

(function($){
	$.getUrlVar = function(key){
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
	return result && unescape(result[1]) || "";
	};
})(jQuery);

pks.api.init();