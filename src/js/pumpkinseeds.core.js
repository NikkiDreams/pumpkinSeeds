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

$.fn.exists = function () {
	return jQuery(this).length > 0;
};

