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
_pksTi = 0;
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
		events: {
			domReady: function () {
				pks.core.model.isDomReady = true;
				$(document).trigger("pks.dom:isReady");
			},
			coreIsReady: function () {
				pks.core.model.isPksCoreActive = true;
				pks.core.api.logger("Event: pks.core:isReady");
				$(document).trigger("pks.core:isReady");
			},
			configIsReady: function () {
				pks.core.model.isClassReady = true;
				$(document).trigger("pks.core.config:isReady");
				if(typeof $(pks.core.config.init_logger) != "undefined" 
						&& $(pks.core.config.init_logger).length > 0){
					pks.core.config.isLogger = true;
				}
				pks.core.api.logger("Event: pks.core.config:isReady");
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

		}
	},
	/** All public interface functions  */
	api: {
		getFormatedTime: function(){
			var time = new Date();
			var hours = time.getHours();
			var minutes = time.getMinutes();
			var seconds = time.getSeconds();
			var milliseconds = time.getMilliseconds();
			
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

			return hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
		},
		logger: function (msg){
			/* TODO: Make Console Logging Congifurable */
			console.log("PKSLog: ",msg,pks.core.model.isClassReady,new Date().getTime() );
			/* TODO: Create  pksLogQueue */
			if(pks.core.model.isClassReady && pks.core.config.isLogger){
				$(pks.core.config.init_logger).append('<div class="log info">'+_pksTi+" : "+msg+" : "+pks.core.api.getFormatedTime()+'</div>');
				_pksTi++;
			}
			else{
				return;
			}
		}
	}
	
};

pks.core.init();

