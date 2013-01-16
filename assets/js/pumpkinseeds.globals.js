/* Pumpkin Seeds Global APIs
 * This Class is used to setup and initialize the core components
 * @author Nichole Shannon
 */

/* Add Class to pks Namespace */
pks.namespace('globals');


pks.globals = {
	init: function () {
		pks.globals.controller.setConstants();

		if (pks.core.model.isClassReady) {
			pks.globals.controller.events.classIsReady();
		}
		else {
			$(document).bind("pks.core:isReady", function () {
				pks.globals.controller.events.classIsReady();
			});
		}

	},
	constants: {
		requestParameters: {},
		/* TEMPLATES will be dependent on JSRender or JSViews */
		templates: {
			PKS: "<div>SOME HTML FRAGMENT</div>",
		}
	},
	model: {
		isClassReady: false,
		isTemplatesReady: false,
		isModelReady: false,
		jsonResponse: null,
		isFormValid: false
	},
	controller: {
		setConstants: function () {
				//var constants = pks.core.globals.constants;
		},
		setTemplates: function () {
			if(pks.globals.model.isTemplatesReady){
				$.templates({
					pksTemplate: pks.globals.constants.templates.PKS,
				});
			}
		},
		validators: {},
		events: {
			classIsReady: function () {
				$(document).trigger("pks.globals:isReady");
				pks.globals.model.isClassReady = true;
				pks.core.api.pkslog("Event: pks.globals:isReady");
				pks.globals.controller.events.templatesReady();
				//pks.globals.view.setModals();
				//pks.globals.view.setAlerts();
				//pks.globals.view.bindEvents();
			},
			templatesReady: function () {
				if(typeof _jsv === 'object'){
					pks.globals.model.isTemplatesReady = true;
					pks.core.api.pkslog("Event: pks.globals:isTemplatesReady");
					$(document).trigger("pks.globals:isTemplatesReady");
					pks.globals.controller.setTemplates();
				}
			}
		}
	},
	validation: {
		
	},
	/** All public interface functions  */
	api: {
		
	},
	/** All functions that output HTML to the client */
	view: {
		bindEvents: function () {

		},
		setModals: function () {

		},
		setMessageCount: function () {

		},
		setAlerts: function () {

		}
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

pks.globals.init();