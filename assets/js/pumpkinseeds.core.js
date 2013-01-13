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


var pks = Class.create(true);
pks.namespace('core');
ti = 0;
pks.core = {
	init: function () {
		pks.core.controller.setConstants();

		$(document).ready(function () {
			pks.core.controller.events.domReady();
		});
	},
	constants: {
		PUMPKINSEEDS_REST_URL: "/pks/fetish",
		JSON_ROOT_NODE: "",
		requestParameters: {
			PKS_PARAMETER: "pks",
			USER_PARAMETER: "pksuser"
		},
		/* TEMPLATES will are dependant on the JSViews and JSRender
		* Template fucntionality will wait until I can review the options more closely
		*/
		templates: {
			PKS_HTML: "SOME HTML FRAGMENT"
		}

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
		validators: null,
		events: {
			domReady: function () {
				pks.core.model.isDomReady = true;
				$(document).trigger("pks.dom:isReady");
			},
			coreIsReady: function () {
				pks.core.model.isPksCoreActive = true;
				pks.core.api.pkslog("Event: pks.core:isReady");
				$(document).trigger("pks.core:isReady");
			},
			configIsReady: function () {
				pks.core.model.isClassReady = true;
				$(document).trigger("pks.core.config:isReady");
				if(typeof $(pks.core.config.init_logger) != "undefined" 
						&& $(pks.core.config.init_logger).length > 0){
					pks.core.config.isLogger = true;
				}
				pks.core.api.pkslog("Event: pks.core.config:isReady");
				pks.core.controller.events.coreIsReady();
				pks.core.controller.events.rootPageDataReady();
			},
			rootPageReady: function () {
				setTimeout(function () {pks.core.controller.getRootPageData(); }, 1000);
			},
			rootPageDataReady: function () {
				pks.core.model.isRootPageDataReady = true;
			},
			getRootPageData: {
				success: function () {
					pks.core.model.isModelReady = true;
					pks.core.controller.buildRootPageIndexMap();
					$(document).trigger("pks.core:isModelReady");
				},
				exception: function () {
					alert("Bad Seeds: Your AJAX Request Failed.");
				}

			}

		},
		getRootPageData: function () {
			$(document).trigger("pks.core:begin");
			var pksCoreURL = pks.core.controller.getpksCoreURL();
			if (pksCoreURL === true) {
				Ajax.Request(pksCoreURL, {
					method: "get",
					onComplete: function (response) {
						pks.core.model.jsonResponse = response.responseJSON[pks.core.constants.JSON_ROOT_NODE];
						pks.core.controller.events.getRootPageData.success();
					},
					onFailure: function (response) {
						pks.core.model.jsonResponse = response.status;
						pks.core.controller.events.getRootPageData.exception();
					}
				});
			}
		},
		/**
		* This method constructs the URL used to request the BasePage REST service
		* */
		getPksCoreURL: function () {
			/*var PUMPKINSEEDS_REST_URL = pks.core.constants.PUMPKINSEEDS_REST_URL;*/
			var constants = pks.core.constants.requestParameters;

			var requestHost = window.location.host;
			var requestProtocol = "http:";
			if (window.location.protocol == "http:") {
				requestProtocol = "http:";
			} else {
				requestProtocol = "https:";
			}

			var userProfileId = null;
			var USER_PARAMETER = gidLib.getQuerystringParam(pks.core.constants.requestParameters.SEM_PARAMETER, true);
			userProfileId = USER_PARAMETER;

			var pksCoreURL = requestProtocol + "//" + requestHost + PUMPKINSEEDS_REST_URL + "/" + userProfileId  ;
			var queryParametersUrlFormatted = pks.core.controller.getQueryParametersUrlFormatted();
			if (queryParametersUrlFormatted !== null) {
				pksCoreURL = pksCoreURL + "?" + queryParametersUrlFormatted;
			}

			return pksCoreURL;
		},
		/**
		* Get any query parameters and append the REST URL string with these params
		* */
		getQueryParametersUrlFormatted: function () {
			var constants = pks.core.constants.requestParameters;
			var queryParametersUrlFormatted = null;
			var queryParameters = [];
			var USER_PARAMETER = gidLib.getQuerystringParam(constants.SEM_PARAMETER, true);

			if (USER_PARAMETER != null && USER_PARAMETER != "") {
				var USER_PARAMETER_ENCODED = encodeURIComponent(USER_PARAMETER);
				queryParameters.push(constants.SEM_PARAMETER + "=" + USER_PARAMETER_ENCODED);
				pks.core.model.defaultUserProfileId = USER_PARAMETER_ENCODED;
			}

			if (queryParameters.length > 0) {
				queryParametersUrlFormatted = queryParameters.join("&");
			}

			return queryParametersUrlFormatted;
		}

	},
	/** All public interface functions  */
	api: {
		pkslog: function (msg){
			console.log("Fucked: ",msg,pks.core.model.isClassReady,new Date().getTime() );
			/* TODO: Create  pksLogQueue */
			if(pks.core.model.isClassReady && pks.core.config.isLogger){
				$(pks.core.config.init_logger).append('<div class="log info">'+ti+" : "+msg+" : "+(new Date().getTime())+'</div>');
				ti++;
			}
			else{
				return;
			}	
		}
	},
	view: null
};

pks.core.init();

