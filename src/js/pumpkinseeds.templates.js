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
	PKS_DATA_SAMPLE_SECTION: '<section class="container"><div class="row"><div class="content  col-md-16">\
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