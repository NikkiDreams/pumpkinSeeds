/* Pumpkin Seeds Core
 * This Class is used to setup and initialize the core components of the entire Pumpkin Seeds API
 * This class is not a dumping ground for global objects. It is the master object for the entire API.
 * The main purpose of this class is to:
 * - instantiate the core namespace
 * - Initialize the Pumpkin Seeds API
 * - Provide entry point for Event driven class readiness
 * - Check DOM and Class Ready state.
 * @author Nichole Shannon
 */
/*
 * Instantiante the Class object for jQuery. JQ has no native class object. (similar to Mootools and Prototype)
 * Further details can be had @ http://code.google.com/p/digg/wiki/Class
 */


var pks = Class.create(true),
	_pksTi = 0;
pks.namespace('core');

pks.core = {
	init: function () {
		pks.core.controller.setConstants();

		$(document).ready(function () {
			pks.core.controller.events.domReady();
		});
	},
	config: null,
	model: {
		isDomReady: false,
		isClassReady: false,
		isPksCoreActive: false,
		isModelReady: false,
		jsonResponse: null,
		pksLogQueue: null
	},
	controller: {
		setConstants: function () {
			var constants = pks.core.constants;
		},
		events: {
			domReady: function () {
				pks.core.model.isDomReady = true;
				$(document).trigger('pks.dom:isReady');
			},
			configIsReady: function () {
				pks.core.model.isClassReady = true;
				$(document).trigger('pks.core.config:isReady');
				if(typeof $(pks.core.config.init_logger) !== 'undefined' && $(pks.core.config.init_logger).length > 0){
					pks.core.config.isLogger = true;
				}
				pks.core.api.logger('Event: pks.core.config:isReady');
				pks.core.controller.events.coreIsReady();
			},
			coreIsReady: function () {
				pks.core.model.isPksCoreActive = true;
				pks.core.api.logger('Event: pks.core:isReady');
				$(document).trigger('pks.core:isReady');
				pks.core.controller.events.librariesReady();
				pks.core.controller.events.corePageData();
			},
			librariesReady: function() {
				if(typeof Backbone === 'object'){
					pks.templates.model.isBackboneReady = true;
					pks.core.api.logger('Library: pks.library:isBackbone');
					$(document).trigger('pks.library:isBackbone');
				}
				if(typeof Handlebars === 'object'){
					pks.templates.model.isHandlebarsReady = true;
					pks.core.api.logger('Library: pks.library:isHandlebars');
					$(document).trigger('pks.library:isHandlebars');
				}
				if(typeof Modernizr === 'object'){
					pks.templates.model.isModernizrReady = true;
					pks.core.api.logger('Library: pks.library:isModernizr');
					$(document).trigger('pks.library:isModernizr');
				}
				if(typeof html5 === 'object'){
					pks.templates.model.isHtml5Ready = true;
					pks.core.api.logger('Library: pks.library:isHtml5');
					$(document).trigger('pks.library:isHtml5');
				}
				if(typeof _jsv === 'object'){
					pks.templates.model.isTemplatesReady = true;
					pks.core.api.logger('Library: pks.library:isJsRender');
					$(document).trigger('pks.library:isJsRender');
					//pks.templates.controller.setTemplates();
				}

			},
			corePageData: function () {
				setTimeout(function () { pks.core.controller.getCorePageData(); }, 1000);
			},
			corePageDataReady: function () {
				pks.core.model.isCorePageDataReady = true;
			},
			getCorePageDataHandler: {
				success: function () {
					$(document).trigger('pks.core.data:end');
					pks.core.api.logger('Event: pks.core.data:end');
				},
				complete: function () {
					pks.core.model.isModelReady = true;
					//pks.core.controller.buildCorePageIndexMap();
					$(document).trigger('pks.core:isModelReady');
					pks.core.api.logger('Event: pks.core:isModelReady');
					
					//TODO: Move this SOON - it's just temporary
					var data = pks.core.model.jsonResponse;
					pks.core.model.jsonResponse = data;
					pks.api.prependApiDataObject(data, 'footer');
					
				},
				exception: function () {
					pks.core.model.isModelReady = false;
					$(document).trigger('pks.core.data:end');
					pks.core.api.logger('ERROR: Bad Seeds, PKS Core AJAX Request Failed. '+pks.core.model.jsonResponse);
				}
			}
		},
		getCorePageData: function () {
			$(document).trigger('pks.core.data:begin');
			pks.core.api.logger('Event: pks.core.data:begin');

			var pksCoreURL = pks.core.controller.getPksCoreURL(),
				pksCoreURLData = '';

			if (pksCoreURL !== false) {
				$.getJSON( pksCoreURL )
					.success(function(){
						pks.core.controller.events.getCorePageDataHandler.success();
					})
					.complete(function (data, textStatus) {
						pks.core.model.jsonResponse = $.parseJSON(data.responseText);
						pks.core.controller.events.getCorePageDataHandler.complete();
					})
					.error(function (xhr, textStatus, errorThrown) {
						pks.core.model.jsonResponse = errorThrown;
						pks.core.controller.events.getCorePageDataHandler.exception();
					});
			}
		},
		/**
		* This method constructs the URL used to request a REST service
		* */
		getPksCoreURL: function () {
			var DATA_URL = pks.core.config.constants.PUMPKINSEEDS_REST_URL,
				DATA_SET = pks.core.config.constants.PUMPKINSEEDS_JSON_DATA,
				constants = pks.core.config.requestParameters,
				requestHost = window.location.host,
				requestProtocol = 'http:',
				pksCoreURL;

			if (window.location.protocol === 'http:') {
				requestProtocol = 'http:';
			} else {
				requestProtocol = 'https:';
			}
		
			pksCoreURL = requestProtocol + '//' + requestHost + DATA_URL + DATA_SET;
			/*var formatedParamters = pks.api.getQueryParameters();
			if (formatedParamters !== null) {
				pksCoreURL = pksCoreURL + "?" + formatedParamters;
			}
			*/
			pks.core.api.logger('INFO: pks.core data url: '+ pksCoreURL);
			if(pksCoreURL){
				return pksCoreURL;
			}
			else{
				return false;
			}
			
		}
	},
	/** All public interface functions  */
	api: {
		getFormatedTime: function(){
			var time = new Date(),
				hours = time.getHours(),
				minutes = time.getMinutes(),
				seconds = time.getSeconds(),
				milliseconds = time.getMilliseconds();
			
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			if (milliseconds < 10) {
				milliseconds = '0' + milliseconds;
			}

			return hours + ':' + minutes + ':'+ seconds + ':' + milliseconds;
		},
		logger: function (msg){
			/* TODO: Make Console Logging Congifurable */
			console.log('PKSLog: ',msg,pks.core.model.isClassReady,new Date().getTime() );
			/* TODO: Create  pksLogQueue */
			if(pks.core.model.isClassReady && pks.core.config.isLogger){
				$(pks.core.config.init_logger).prepend('<div class="log info">'+_pksTi+' : '+msg+' : '+pks.core.api.getFormatedTime()+'</div>');
				_pksTi++;
			}
			else{
				return;
			}
		}
	}
	
};

pks.core.init();

;/* Pumpkin Seeds Core Config 
 * This Class is used to setup and initialize the core components
 * @author Nichole Shannon
 */

/* Add Class to pks.core Namespace */
pks.namespace('core.config');

pks.core.config = {
	init_logger: '#init_logger',
	isLogger: false,
	isCurrentUser: false,
	init: function () {
		/* This is more of a safety mechinism than anything else. 
		* 100% assurance pks.core.config is available before we do stuff
		*/
		if (pks.core.model.isPksCoreActive) {
			pks.core.controller.events.configIsReady();
		}
		else {
			$(document).on('pks.dom:isReady', function () {
				pks.core.controller.events.configIsReady();
			});
		}
	},
	constants: {
		PUMPKINSEEDS_REST_URL: '/assets/data/',
		PUMPKINSEEDS_JSON_DATA: 'seeds.json',
		JSON_ROOT_NODE: '',
		requestParameters: {
			PKS_PARAMETER: 'pks',
			USER_PARAMETER: 'pksuser'
		}
	}
};


pks.core.config.init();
;/* Pumpkin Seeds Global APIs
 * This Class is used to setup and initialize the core components
 * @author Nichole Shannon
 */

/* Add Class to pks Namespace */
pks.namespace('api');


pks.api = {
	init: function () {
		if (pks.core.model.isClassReady) {
			pks.api.controller.events.classIsReady();
		}
		else {
			$(document).on('pks.core:isReady', function () {
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
		events: {
			classIsReady: function () {
				$(document).trigger('pks.api:isReady');
				pks.api.model.isClassReady = true;
				pks.core.api.logger('Event: pks.api:isReady');
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
		pks.core.config.constants.formatedParamters = null;
		pks.core.config.constants.queryParameters = [];
		pks.core.config.constants.userParameters = null;

		return pks.core.config.constants.formatedParamters;
	},
	/**
	* This method constructs the URL used to request a REST service
	* */
	getPksCoreURL: function () {
		var PUMPKINSEEDS_REST_URL = pks.core.config.constants.PUMPKINSEEDS_REST_URL,
			foo,
			requestHost = window.location.host,
			requestProtocol = 'http:',
			pksCoreURL,
			formatedParamters;

		if (window.location.protocol === 'http:') {
			requestProtocol = 'http:';
		} else {
			requestProtocol = 'https:';
		}

		pksCoreURL = requestProtocol + '//' + requestHost + PUMPKINSEEDS_REST_URL + '/' + foo;
		formatedParamters = pks.api.getQueryParameters();
		if (formatedParamters !== null) {
			pksCoreURL = pksCoreURL + '?' + formatedParamters;
		}

		return pksCoreURL;
	},
	/* Sample API Call to destroy and rewrite the initial API Core JSON Sample */
	prependApiDataObject:function(data, obj){
		//TODO: JS Templatize this using JSViews or Handlebars
		var content = '<section class="container" id="pks_core_JSON_sample"><div class="row-fluid"><div class="content span10">\
			<h2>PKS Core JSON Response</h2>\
			<label>API Name: ' + data.API + '</label>\
			<label>API Version: ' + data.version + '</label>\
			<h5>Sample Data: '+ pks.core.config.constants.PUMPKINSEEDS_JSON_DATA +'</h5>\
			<label>data.geolocation.country.USA.states:<br/><pre>' + JSON.stringify(data.geolocation.country.USA.states) + '</pre></label>\
			<label>data.user.identity:<br/><pre>' + JSON.stringify(data.user.identity) + '</pre></label>\
			<label>data.user.orientation:<br/><pre>' + JSON.stringify(data.user.orientation) + '</pre></label>\
			<label>data.user.status:<br/><pre>' + JSON.stringify(data.user.status) + '</pre></label>\
			</div></div></section>';

		if( document.getElementById('pks_core_JSON_sample') ){
			$('#pks_core_JSON_sample').fadeOut('slow', function(){
				$(this).remove();
				$(obj).before(content);
			});
		}
		else{
			$(obj).before(content);
		}

		pks.core.api.logger('API: pks.prependApiDataObject');
	}

};

// convert form data to JSON
$.fn.serializeObject = function () {
	var o = {},
		a = this.serializeArray();
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
		var result = new RegExp(key + '=([^&]*)', 'i').exec(window.location.search),
			resultUn = decodeURI(result[1]) || '';
		return result + resultUn;
	};
})(jQuery);


pks.api.init();;/* Pumpkin Seeds Templates
 * This Class is used to setup and initialize the core components
 * @author Nichole Shannon
 */

/* Add Class to pks Namespace */
pks.namespace('templates');


pks.templates = {
	init: function () {
		if (pks.api.model.isClassReady) {
			pks.templates.controller.events.classIsReady();
		}
		else {
			$(document).on('pks.api:isReady', function () {
				pks.templates.controller.events.classIsReady();
			});
		}
	},
	model: {
		isClassReady: false,
		isModelReady: false,
		isTemplatesReady: false
	},
	controller: {
		setTemplates: function () {
			if(pks.templates.model.isTemplatesReady){
				$.templates({
					pksTemplate: pks.templates.PKS_TEMPLATE
				});
			}
		},
		events: {
			classIsReady: function () {
				$(document).trigger('pks.templates:isReady');
				pks.templates.model.isClassReady = true;
				pks.core.api.logger('Event: pks.templates:isReady');
				pks.templates.controller.events.templatesReady();
			},
			templatesReady: function () {
				if(typeof _jsv === 'object'){
					pks.templates.model.isTemplatesReady = true;
					pks.core.api.logger('Event: pks.templates:isTemplatesReady');
					$(document).trigger('pks.templates:isTemplatesReady');
					pks.templates.controller.setTemplates();
				}
			}
		}
	},
	PKS_TEMPLATE: '<div>SOME HTML FRAGMENT</div>',
	PKS_DATA_SAMPLE_SECTION: '<section class="container"><div class="row-fluid"><div class="content span10">\
						<h2>PKS Core JSON Response</h2> \
						<label>API Name: {{: +api_name}}</label>\
						<label>API Version: {{: +api_version}}</label>\
						<h5>Sample Data: {{: +seed_name}}</h5>\
						<label>data.user.identity:<br/>{{: +user_identity}}</label>\
						<label>data.user.orientation:<br/>{{: +user_orientation}}</label>\
						<label>data.user.status:<br/>{{: +user_status}}</label>\
						</div></div></section>'

};


pks.templates.init();