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
		en_us:{},
		pks_base_container: '#pks_core_container'
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
				$(document).on('pks.core:isModelReady', function(){
					pks.api.prependApiDataObject(pks.core.model.jsonResponse);
				});
				
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
	createViewContainer: function(id, styleClass, target){
		var tObj = (target)?target:'#top_section',
			baseId = (id)?id:'pks_core_container',
			style = (styleClass)?' '+styleClass:'',
			baseContainer = '\
				<section class="container'+style+'" id="'+baseId+'">\
					<div class="row"></div>\
				</section>';
		
		if( $(tObj).exists() && !$('#'+baseId).exists() ){
			$(tObj).after(baseContainer);
			return true;
		}
		else if( !$(tObj).exists() ){
			return false;
		}
		return true;
	},
	/* Sample API Call to destroy and rewrite the initial API Core JSON Sample */
	prependApiDataObject:function(model){
		var data =  {
				'API': model.API,
				'version': model.version,
				'seed_name': pks.core.config.constants.PUMPKINSEEDS_JSON_DATA,
				'geolocation': JSON.stringify(model.geolocation.country.USA.states),
				'identity': JSON.stringify(model.user.identity),
				'orientation': JSON.stringify(model.user.orientation),
				'status': JSON.stringify(model.user.status),
				'contentId': 'api_json_data',
				'extraStyle': ''
			},
			myTemplate = $.templates(pks.templates.PKS_API_DATA_SAMPLE_SECTION),
			html = myTemplate.render(data),
			containerId = 'pks_core_examples',
			targetContainer = pks.api.createViewContainer(containerId,null,null);

		$('#'+containerId+' > .row:first-child').prepend(html);
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
	PKS_API_DATA_SAMPLE_SECTION: '\
		<div class="col-md-10 {{: extraStyle }}" id="{{: contentId }}">\
			<div class="content">\
				<h2>PKS Core JSON Response</h2> \
				<label>API Name: {{: API }}</label>\
				<label>API Version: {{: version }}</label>\
				<h5>Sample Data: {{: seed_name }}</h5>\
				<label>data.geolocation.country.USA.states:<br/><pre>{{: geolocation }}</pre></label>\
				<label>data.user.identity:<br/><pre>{{: identity }}</pre></label>\
				<label>data.user.orientation:<br/><pre>{{: orientation }}</pre></label>\
				<label>data.user.status:<br/><pre>{{: status }}</pre></label>\
			</div>\
		</div>',
	PKS_LASTFM_CURRENT_SONG_PLAYING: '\
		<div class="col-md-5 {{: extraStyle }}" id="{{: contentId }}">\
			<div class="nowplaying content  clearfix">\
		        <div class="nowPlayingBg cssBGfilters full-width-overlay">\
		            <div class="art" style="background-image: url({{: tracks[0].images.extralarge}});"></div>\
		        </div>\
		        <div class="track-details-wrapper" data-utc="{{: tracks[0].utc}}">\
	                <div class="track-details">\
	                    <a class="artwork media-pull-left media-link-hook" href="{{: tracks[0].url}}">\
	                        <img src="{{: tracks[0].images.mega}}" alt="Artwork for {{: tracks[0].name}}" />\
	                    </a>\
	                    <div class="media-body">\
                            <div class="vertically-center track-meta">\
                                <h3 class="now-playing-subtext">\
                                    <a href="{{: _meta.subject.url}}" class="strong">{{: _meta.subject.name}}</a> is playing\
                                    <a href="{{: _meta.subject.url}}" class="strong hide">{{: _meta.subject.name}}</a> <span class="hide">just played</span>\
                                    <a href="{{: _meta.subject.url}}" class="strong hide">{{: _meta.subject.name}}</a> <span class="hide">last played</span>\
                                </h3>\
                                <a href="{{: tracks[0].url}}" class="track-name">{{: tracks[0].name}}</a>\
                                <div class="artist-name">\
                                    by <a href="{{: tracks[0].artist.url}}">\
                                        {{: tracks[0].artist.name}}\
                                    </a>\
                                </div>\
                                <div class="album-name">\
                                    {{: tracks[0].album.name}}\
                                </div>\
                            </div>\
	                    </div>\
	                </div>\
		        </div>\
		        <div data-page-title class="hide">\
		            {{: tracks[0].name}} by {{: tracks[0].artist.name}} (now playing)\
		            {{: tracks[0].name}} by {{: tracks[0].artist.name}} (just listened)\
		            {{: tracks[0].name}} by {{: tracks[0].artist.name}} (last played track)\
		            No recent tracks - Last.fm\
		        </div>\
		        <div class="no-content-message hide">\
		            Sorry, {{: _meta.subject.name}} hasn’t played any tracks recently.<br /><a href="{{: _meta.subject.url}}">Return to their profile</a>.\
		        </div>\
		    </div>\
	    </div>'

};


pks.templates.init();;/* Pumpkin Seeds Global lastfms
 * This Class is used to setup and initialize the core components
 * @author Nichole Shannon
 */

/* Add Class to pks Namespace */
pks.namespace('lastfm');


pks.lastfm = {
	init: function () {
		if (pks.core.model.isClassReady) {
			pks.lastfm.controller.events.classIsReady();
		}
		else {
			$(document).on('pks.api:isReady', function () {
				pks.lastfm.controller.events.classIsReady();
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
				$(document).trigger('pks.lastfm:isReady');
				pks.api.model.isClassReady = true;
				pks.core.api.logger('Event: pks.lastfm:isReady');

				pks.lastfm.view.init();
			}
		}
	},
	validation: null,
	/** All public interface functions  */
	/**
	* This method constructs the URL used to request a REST service ?
	* */
	getLastfmAPI: function (apiURL, apiParams) {
		var LASTFM_REST_URL = (apiURL)?apiURL:'api/lastfmapi',
			params = (apiParams)?apiParams:'nowplaying.php/nikkidreams',
			requestProtocol = 'http:',
			requestHost = window.location.host,
			pksLastfmURL,
			formatedParamters = null;

		if (window.location.protocol === 'http:') {
			requestProtocol = 'http:';
		} else {
			requestProtocol = 'https:';
		}

		pksLastfmURL = requestProtocol + '//' + requestHost + '/' + LASTFM_REST_URL + '/' + params;
		/*formatedParamters = pks.lastfm.getQueryParameters();
		if (formatedParamters !== null) {
			pksLastfmURL = pksLastfmURL + '?' + formatedParamters;
		}
		*/

		$.get(pksLastfmURL).done(function(data){
			pks.lastfm.model.jsonRespnse = data;
			$(document).trigger('pks.lastfm:dataResponse:Ready');
		});

		//return pksLastfmURL;
	},
	view:{
		init:function(){
			pks.lastfm.view.displayCurrentSongPlaying();
		},
		displayCurrentSongPlaying : function(serName){
			/*
			
			*/
			pks.lastfm.getLastfmAPI();

			$(document).on('pks.lastfm:dataResponse:Ready', function(){
				var data = {
					'_meta' : {
						'subject' : {
							'_type' : 'user',
							'is_music' : false,
							'name' : 'NikkiDreams',
							'url' : '/user/NikkiDreams'
						},
						'url' : '/user/NikkiDreams/now'
					},
					'tracks': pks.lastfm.model.jsonRespnse,
					'contentId': 'lastfm_current_song',
					'extraStyle': 'col-md-offset-1 relative'
				},
					lastTemplate = $.templates(pks.templates.PKS_LASTFM_CURRENT_SONG_PLAYING),
					html = lastTemplate.render(data),
					contenId = 'pks_core_examples',
					targetContainer = pks.api.createViewContainer(contenId,null,null);

				$('#'+contenId+' > .row:first-child').append(html);
			});
		}
	}

};


pks.lastfm.init();