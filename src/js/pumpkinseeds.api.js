/* Pumpkin Seeds Global APIs
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


pks.api.init();