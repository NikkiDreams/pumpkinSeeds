/* Pumpkin Seeds Templates
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
			$(document).bind("pks.api:isReady", function () {
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
				$(document).trigger("pks.templates:isReady");
				pks.templates.model.isClassReady = true;
				pks.core.api.logger("Event: pks.templates:isReady");
				pks.templates.controller.events.templatesReady();
			},
			templatesReady: function () {
				if(typeof _jsv === 'object'){
					pks.templates.model.isTemplatesReady = true;
					pks.core.api.logger("Event: pks.templates:isTemplatesReady");
					$(document).trigger("pks.templates:isTemplatesReady");
					pks.templates.controller.setTemplates();
				}
			}
		}
	},
	PKS_TEMPLATE: "<div>SOME HTML FRAGMENT</div>"

};


pks.templates.init();